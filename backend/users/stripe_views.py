import stripe
from django.conf import settings
from django.utils import timezone
from datetime import datetime, timezone as dt_tz, timedelta
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from drf_spectacular.utils import extend_schema
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .models import User, UserSubscription

stripe.api_key = settings.STRIPE_SECRET_KEY


# =============================================================================
# CHECKOUT - For NEW subscriptions only
# =============================================================================

class CreateCheckoutSessionView(APIView):
    """Create Stripe Checkout session for NEW subscription."""
    
    permission_classes = [IsAuthenticated]
    
    @extend_schema(tags=['Billing'], summary="Create checkout session")
    def post(self, request):
        plan = request.data.get('plan')
        billing_cycle = request.data.get('billing_cycle', 'monthly')
        
        price_key = f"{plan}_{billing_cycle}"
        price_id = settings.STRIPE_PRICES.get(price_key)
        
        if not price_id:
            return Response(
                {'error': f'Invalid plan: {price_key}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = request.user
        subscription = user.subscription
        
        if subscription.stripe_subscription_id:
            return Response(
                {'error': 'You already have an active subscription. Use change plan instead.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not subscription.stripe_customer_id:
            customer = stripe.Customer.create(
                email=user.email,
                name=user.full_name,
                metadata={'user_id': str(user.id)}
            )
            subscription.stripe_customer_id = customer.id
            subscription.save()
        
        try:
            checkout_session = stripe.checkout.Session.create(
                customer=subscription.stripe_customer_id,
                payment_method_types=['card'],
                line_items=[{
                    'price': price_id,
                    'quantity': 1,
                }],
                mode='subscription',
                success_url=f"{settings.FRONTEND_URL}/app/settings/billing?success=true",
                cancel_url=f"{settings.FRONTEND_URL}/app/settings/billing?canceled=true",
                metadata={
                    'user_id': str(user.id),
                    'plan': plan,
                    'billing_cycle': billing_cycle,
                },
                subscription_data={
                    'metadata': {
                        'user_id': str(user.id),
                        'plan': plan,
                        'billing_cycle': billing_cycle,
                    }
                },
            )
            
            return Response({'checkout_url': checkout_session.url})
        
        except stripe.error.StripeError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# =============================================================================
# CHANGE PLAN - For existing subscribers
# =============================================================================

class ChangePlanView(APIView):
    """Change subscription plan with correct billing logic."""
    
    permission_classes = [IsAuthenticated]
    
    @extend_schema(tags=['Billing'], summary="Change subscription plan")
    def post(self, request):
        new_plan = request.data.get('plan')
        new_cycle = request.data.get('billing_cycle', 'monthly')
        
        user = request.user
        subscription = user.subscription
        
        if not subscription.stripe_subscription_id:
            return Response(
                {'error': 'No active subscription. Please subscribe first.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        current_plan = subscription.plan
        current_cycle = subscription.billing_cycle
        
        if new_plan == current_plan and new_cycle == current_cycle:
            return Response(
                {'error': 'You are already on this plan.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        price_key = f"{new_plan}_{new_cycle}"
        new_price_id = settings.STRIPE_PRICES.get(price_key)
        
        if not new_price_id:
            return Response(
                {'error': f'Invalid plan: {price_key}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        change_type = self._get_change_type(current_plan, current_cycle, new_plan, new_cycle)
        print(f"DEBUG ChangePlan: {current_plan} {current_cycle} → {new_plan} {new_cycle} = {change_type}")
        
        try:
            if change_type == 'same_plan_cycle_change':
                # Pro Monthly → Pro Yearly (same features, different duration)
                # → Checkout, pay full new price, add time to current expiry
                return self._handle_cycle_change(user, subscription, new_plan, new_cycle, new_price_id)
            
            elif change_type == 'upgrade_same_cycle':
                # Pro Monthly → Premium Monthly (same cycle)
                # → Stripe proration (pay difference), keep same billing date
                return self._handle_upgrade_same_cycle(user, subscription, new_plan, new_cycle, new_price_id)
            
            elif change_type == 'upgrade_different_cycle':
                # Pro Monthly → Premium Yearly OR Pro Yearly → Premium Monthly
                # → Checkout, pay full new price with credit, new expiry based on new cycle
                return self._handle_upgrade_different_cycle(user, subscription, new_plan, new_cycle, new_price_id)
            
            elif change_type == 'downgrade':
                # Premium → Pro (any cycle combination)
                # → Checkout, pay full new price, add time to current expiry
                return self._handle_downgrade(user, subscription, new_plan, new_cycle, new_price_id)
            
            else:
                return Response({'error': 'Invalid change type'}, status=status.HTTP_400_BAD_REQUEST)
        
        except stripe.error.CardError as e:
            return Response(
                {'error': f'Payment failed: {e.user_message}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except stripe.error.StripeError as e:
            print(f"Stripe error: {e}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def _get_change_type(self, current_plan, current_cycle, new_plan, new_cycle):
        """Determine the type of plan change."""
        plan_tier = {'free': 0, 'pro': 1, 'premium': 2}
        current_tier = plan_tier.get(current_plan, 0)
        new_tier = plan_tier.get(new_plan, 0)
        
        # Same plan, different cycle
        if current_tier == new_tier:
            return 'same_plan_cycle_change'
        
        # Upgrade
        if new_tier > current_tier:
            if current_cycle == new_cycle:
                return 'upgrade_same_cycle'
            else:
                return 'upgrade_different_cycle'
        
        # Downgrade
        return 'downgrade'
    
    def _handle_cycle_change(self, user, subscription, new_plan, new_cycle, new_price_id):
        """
        Same plan, different cycle (Pro Monthly → Pro Yearly).
        
        - Go to Stripe checkout
        - Pay full new price
        - New expiry = current expiry + new cycle duration
        """
        current_expiry = subscription.expires_at or timezone.now()
        cycle_days = 365 if new_cycle == 'yearly' else 30
        new_expiry = current_expiry + timedelta(days=cycle_days)
        
        checkout_session = stripe.checkout.Session.create(
            customer=subscription.stripe_customer_id,
            payment_method_types=['card'],
            line_items=[{'price': new_price_id, 'quantity': 1}],
            mode='subscription',
            success_url=f"{settings.FRONTEND_URL}/app/settings/billing?success=true",
            cancel_url=f"{settings.FRONTEND_URL}/app/settings/billing?canceled=true",
            metadata={
                'user_id': str(user.id),
                'plan': new_plan,
                'billing_cycle': new_cycle,
                'change_type': 'same_plan_cycle_change',
                'old_subscription_id': subscription.stripe_subscription_id,
                'new_expiry': new_expiry.isoformat(),
            },
            subscription_data={
                'metadata': {
                    'user_id': str(user.id),
                    'plan': new_plan,
                    'billing_cycle': new_cycle,
                }
            },
        )
        
        return Response({
            'checkout_url': checkout_session.url,
            'change_type': 'same_plan_cycle_change',
            'message': f'Your remaining time will be kept, plus {new_cycle} added.',
        })
    
    def _handle_upgrade_same_cycle(self, user, subscription, new_plan, new_cycle, new_price_id):
        """
        Upgrade within same cycle (Pro Monthly → Premium Monthly OR Pro Yearly → Premium Yearly).
        
        - Use Stripe proration (instant)
        - Pay the difference
        - Keep same billing date
        """
        stripe_sub = stripe.Subscription.retrieve(subscription.stripe_subscription_id)
        stripe_sub_dict = dict(stripe_sub)
        
        items_data = stripe_sub_dict.get('items', {}).get('data', [])
        if not items_data:
            return Response({'error': 'Invalid subscription'}, status=status.HTTP_400_BAD_REQUEST)
        
        subscription_item_id = items_data[0]['id']
        
        # Modify with proration - Stripe charges difference immediately
        updated_sub = stripe.Subscription.modify(
            subscription.stripe_subscription_id,
            items=[{
                'id': subscription_item_id,
                'price': new_price_id,
            }],
            proration_behavior='always_invoice',
            payment_behavior='error_if_incomplete',
            metadata={
                'user_id': str(user.id),
                'plan': new_plan,
                'billing_cycle': new_cycle,
            }
        )
        
        # Update local database (keep same expiry)
        subscription.plan = new_plan
        subscription.billing_cycle = new_cycle
        subscription.save()
        
        return Response({
            'message': f'Upgraded to {new_plan.title()}! Charged the price difference.',
            'plan': new_plan,
            'billing_cycle': new_cycle,
            'next_billing_date': subscription.expires_at.isoformat() if subscription.expires_at else None,
        })
    
    def _handle_upgrade_different_cycle(self, user, subscription, new_plan, new_cycle, new_price_id):
        """
        Upgrade with different cycle (Pro Monthly → Premium Yearly OR Pro Yearly → Premium Monthly).
        
        - Go to Stripe checkout
        - Pay full new price (with credit for remaining time)
        - New expiry = now + new cycle duration
        """
        # Calculate credit for remaining time on current plan
        remaining_value = self._calculate_remaining_value(subscription)
        
        cycle_days = 365 if new_cycle == 'yearly' else 30
        new_expiry = timezone.now() + timedelta(days=cycle_days)
        
        checkout_params = {
            'customer': subscription.stripe_customer_id,
            'payment_method_types': ['card'],
            'line_items': [{'price': new_price_id, 'quantity': 1}],
            'mode': 'subscription',
            'success_url': f"{settings.FRONTEND_URL}/app/settings/billing?success=true",
            'cancel_url': f"{settings.FRONTEND_URL}/app/settings/billing?canceled=true",
            'metadata': {
                'user_id': str(user.id),
                'plan': new_plan,
                'billing_cycle': new_cycle,
                'change_type': 'upgrade_different_cycle',
                'old_subscription_id': subscription.stripe_subscription_id,
                'new_expiry': new_expiry.isoformat(),
            },
            'subscription_data': {
                'metadata': {
                    'user_id': str(user.id),
                    'plan': new_plan,
                    'billing_cycle': new_cycle,
                }
            },
        }
        
        # Apply credit as coupon
        if remaining_value > 0:
            try:
                coupon = stripe.Coupon.create(
                    amount_off=remaining_value,
                    currency='eur',
                    duration='once',
                    name='Credit for remaining subscription time',
                    max_redemptions=1,
                )
                checkout_params['discounts'] = [{'coupon': coupon.id}]
            except Exception as e:
                print(f"Error creating coupon: {e}")
        
        checkout_session = stripe.checkout.Session.create(**checkout_params)
        
        return Response({
            'checkout_url': checkout_session.url,
            'change_type': 'upgrade_different_cycle',
            'credit_applied': remaining_value / 100 if remaining_value else 0,
            'message': f'Upgrade to {new_plan.title()} {new_cycle}. Credit of €{remaining_value/100:.2f} applied.',
        })
    
    def _handle_downgrade(self, user, subscription, new_plan, new_cycle, new_price_id):
        """
        Downgrade (Premium → Pro, any cycle).
        
        - Go to Stripe checkout
        - Pay full new plan price
        - New expiry = current expiry + new cycle duration
        """
        current_expiry = subscription.expires_at or timezone.now()
        cycle_days = 365 if new_cycle == 'yearly' else 30
        new_expiry = current_expiry + timedelta(days=cycle_days)
        
        checkout_session = stripe.checkout.Session.create(
            customer=subscription.stripe_customer_id,
            payment_method_types=['card'],
            line_items=[{'price': new_price_id, 'quantity': 1}],
            mode='subscription',
            success_url=f"{settings.FRONTEND_URL}/app/settings/billing?success=true",
            cancel_url=f"{settings.FRONTEND_URL}/app/settings/billing?canceled=true",
            metadata={
                'user_id': str(user.id),
                'plan': new_plan,
                'billing_cycle': new_cycle,
                'change_type': 'downgrade',
                'old_subscription_id': subscription.stripe_subscription_id,
                'new_expiry': new_expiry.isoformat(),
            },
            subscription_data={
                'metadata': {
                    'user_id': str(user.id),
                    'plan': new_plan,
                    'billing_cycle': new_cycle,
                }
            },
        )
        
        return Response({
            'checkout_url': checkout_session.url,
            'change_type': 'downgrade',
            'message': f'Keep current plan until {current_expiry.strftime("%b %d, %Y")}, then {new_plan.title()} starts.',
        })
    
    def _calculate_remaining_value(self, subscription):
        """Calculate remaining value in cents for credit."""
        if not subscription.expires_at or not subscription.plan:
            return 0
        
        now = timezone.now()
        if subscription.expires_at <= now:
            return 0
        
        remaining_days = (subscription.expires_at - now).days
        if remaining_days <= 0:
            return 0
        
        price_key = f"{subscription.plan}_{subscription.billing_cycle}"
        price_id = settings.STRIPE_PRICES.get(price_key)
        
        if not price_id:
            return 0
        
        try:
            price = stripe.Price.retrieve(price_id)
            total_cents = price.unit_amount
            cycle_days = 365 if subscription.billing_cycle == 'yearly' else 30
            daily_rate = total_cents / cycle_days
            return int(daily_rate * remaining_days)
        except Exception as e:
            print(f"Error calculating remaining value: {e}")
            return 0
# =============================================================================
# PORTAL
# =============================================================================

class CreatePortalSessionView(APIView):
    """Create Stripe Customer Portal session."""
    
    permission_classes = [IsAuthenticated]
    
    @extend_schema(tags=['Billing'], summary="Create portal session")
    def post(self, request):
        subscription = request.user.subscription
        
        if not subscription.stripe_customer_id:
            return Response(
                {'error': 'No billing account found'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            portal_session = stripe.billing_portal.Session.create(
                customer=subscription.stripe_customer_id,
                return_url=f"{settings.FRONTEND_URL}/app/settings/billing",
            )
            return Response({'portal_url': portal_session.url})
        except stripe.error.StripeError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# =============================================================================
# CANCEL & REACTIVATE
# =============================================================================

class CancelSubscriptionView(APIView):
    """Cancel subscription at end of billing period."""
    
    permission_classes = [IsAuthenticated]
    
    @extend_schema(tags=['Billing'], summary="Cancel subscription")
    def post(self, request):
        subscription = request.user.subscription
        
        if not subscription.stripe_subscription_id:
            return Response(
                {'error': 'No active subscription'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            stripe.Subscription.modify(
                subscription.stripe_subscription_id,
                cancel_at_period_end=True
            )
            
            subscription.cancelled_at = timezone.now()
            subscription.save()
            
            return Response({
                'message': 'Subscription cancelled. Access continues until end of billing period.',
                'access_until': subscription.expires_at.isoformat() if subscription.expires_at else None
            })
        except stripe.error.StripeError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ReactivateSubscriptionView(APIView):
    """Reactivate a cancelled subscription."""
    
    permission_classes = [IsAuthenticated]
    
    @extend_schema(tags=['Billing'], summary="Reactivate subscription")
    def post(self, request):
        subscription = request.user.subscription
        
        if not subscription.stripe_subscription_id:
            return Response(
                {'error': 'No subscription to reactivate'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            stripe.Subscription.modify(
                subscription.stripe_subscription_id,
                cancel_at_period_end=False
            )
            
            subscription.cancelled_at = None
            subscription.save()
            
            return Response({'message': 'Subscription reactivated!'})
        except stripe.error.StripeError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# =============================================================================
# WEBHOOKS
# =============================================================================
@method_decorator(csrf_exempt, name='dispatch')
class StripeWebhookView(APIView):
    """Handle Stripe webhooks."""
    
    permission_classes = [AllowAny]
    
    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except (ValueError, stripe.error.SignatureVerificationError):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        event_type = event['type']
        data = event['data']['object']
        
        print(f"DEBUG Webhook received: {event_type}")
        
        handlers = {
            'checkout.session.completed': self._handle_checkout_completed,
            'customer.subscription.created': self._handle_subscription_created,
            'customer.subscription.updated': self._handle_subscription_updated,
            'customer.subscription.deleted': self._handle_subscription_deleted,
            'invoice.payment_succeeded': self._handle_payment_succeeded,
            'invoice.payment_failed': self._handle_payment_failed,
        }
        
        handler = handlers.get(event_type)
        if handler:
            handler(data)
        
        return Response({'status': 'success'})
    
    def _get_period_end(self, stripe_sub_dict):
        """Extract current_period_end from Stripe subscription dict."""
        # Try direct access
        if stripe_sub_dict.get('current_period_end'):
            return stripe_sub_dict['current_period_end']
        
        # Try from items
        items_data = stripe_sub_dict.get('items', {}).get('data', [])
        if items_data:
            item = items_data[0]
            if item.get('current_period_end'):
                return item['current_period_end']
        
        # Calculate from billing_cycle_anchor
        billing_anchor = stripe_sub_dict.get('billing_cycle_anchor')
        if billing_anchor:
            plan = stripe_sub_dict.get('plan', {})
            interval = plan.get('interval', 'month')
            if interval == 'year':
                return billing_anchor + (365 * 24 * 60 * 60)
            else:
                return billing_anchor + (30 * 24 * 60 * 60)
        
        return None
    
    def _handle_checkout_completed(self, session):
        """Handle checkout completion with custom expiry logic."""
        user_id = session.get('metadata', {}).get('user_id')
        if not user_id:
            return
        
        print(f"DEBUG checkout: Processing for user_id={user_id}")
        
        try:
            user = User.objects.get(id=user_id)
            subscription = user.subscription
            
            stripe_sub_id = session.get('subscription')
            if not stripe_sub_id:
                return
            
            # Get metadata
            metadata = session.get('metadata', {})
            plan = metadata.get('plan')
            billing_cycle = metadata.get('billing_cycle', 'monthly')
            change_type = metadata.get('change_type')
            old_subscription_id = metadata.get('old_subscription_id')
            new_expiry_str = metadata.get('new_expiry')
            
            print(f"DEBUG checkout: change_type={change_type}, plan={plan}, billing_cycle={billing_cycle}")
            
            # Cancel old subscription if this is a plan change
            if old_subscription_id:
                try:
                    stripe.Subscription.cancel(old_subscription_id)
                    print(f"DEBUG checkout: Cancelled old subscription {old_subscription_id}")
                except Exception as e:
                    print(f"DEBUG checkout: Error cancelling old sub: {e}")
            
            # Update subscription
            subscription.plan = plan
            subscription.billing_cycle = billing_cycle
            subscription.stripe_subscription_id = stripe_sub_id
            subscription.started_at = timezone.now()
            subscription.trial_used = True
            subscription.cancelled_at = None
            
            # Set expiry based on change type
            if new_expiry_str:
                # Use pre-calculated expiry (for cycle changes and downgrades)
                subscription.expires_at = datetime.fromisoformat(new_expiry_str.replace('Z', '+00:00'))
                print(f"DEBUG checkout: Using custom expiry: {subscription.expires_at}")
            elif change_type == 'upgrade_to_yearly':
                # New yearly subscription starts now
                subscription.expires_at = timezone.now() + timedelta(days=365)
                print(f"DEBUG checkout: Yearly upgrade, expires: {subscription.expires_at}")
            else:
                # Default: get from Stripe or calculate
                stripe_sub = stripe.Subscription.retrieve(stripe_sub_id)
                stripe_sub_dict = dict(stripe_sub)
                current_period_end = self._get_period_end(stripe_sub_dict)
                
                if current_period_end:
                    subscription.expires_at = datetime.fromtimestamp(current_period_end, tz=dt_tz.utc)
                else:
                    days = 365 if billing_cycle == 'yearly' else 30
                    subscription.expires_at = timezone.now() + timedelta(days=days)
                print(f"DEBUG checkout: Default expiry: {subscription.expires_at}")
            
            # Update payment method
            stripe_sub = stripe.Subscription.retrieve(stripe_sub_id)
            self._update_payment_method(subscription, dict(stripe_sub))
            
            subscription.save()
            print(f"DEBUG checkout: SUCCESS - {user.email}: {plan} {billing_cycle}, expires={subscription.expires_at}")
        
        except User.DoesNotExist:
            print(f"DEBUG checkout: User {user_id} not found")
        except Exception as e:
            print(f"DEBUG checkout: Error: {e}")
            import traceback
            traceback.print_exc()
    def _handle_subscription_created(self, stripe_sub):
        """Handle subscription creation."""
        stripe_sub_id = stripe_sub.get('id')
        print(f"DEBUG sub_created: stripe_sub_id={stripe_sub_id}")
    
    def _handle_subscription_updated(self, stripe_sub):
        """Handle subscription updates including cancellations from portal."""
        stripe_sub_id = stripe_sub.get('id')
        
        # Log ALL relevant fields
        print(f"DEBUG sub_updated: ========== START ==========")
        print(f"DEBUG sub_updated: stripe_sub_id={stripe_sub_id}")
        print(f"DEBUG sub_updated: status={stripe_sub.get('status')}")
        print(f"DEBUG sub_updated: cancel_at_period_end={stripe_sub.get('cancel_at_period_end')}")
        print(f"DEBUG sub_updated: canceled_at={stripe_sub.get('canceled_at')}")
        print(f"DEBUG sub_updated: cancel_at={stripe_sub.get('cancel_at')}")
        print(f"DEBUG sub_updated: cancellation_details={stripe_sub.get('cancellation_details')}")
        print(f"DEBUG sub_updated: ========== END ==========")
        
        try:
            subscription = UserSubscription.objects.get(stripe_subscription_id=stripe_sub_id)
            print(f"DEBUG sub_updated: Found user {subscription.user.email}")
            print(f"DEBUG sub_updated: Current cancelled_at={subscription.cancelled_at}")
            
            # Update expiry
            current_period_end = self._get_period_end(stripe_sub)
            if current_period_end:
                subscription.expires_at = datetime.fromtimestamp(current_period_end, tz=dt_tz.utc)
                print(f"DEBUG sub_updated: Updated expires_at to {subscription.expires_at}")
            
            # Update plan from metadata
            metadata = stripe_sub.get('metadata', {})
            if metadata.get('plan'):
                subscription.plan = metadata['plan']
            if metadata.get('billing_cycle'):
                subscription.billing_cycle = metadata['billing_cycle']
            
            # Check ALL cancellation indicators
            cancel_at_period_end = stripe_sub.get('cancel_at_period_end', False)
            canceled_at = stripe_sub.get('canceled_at')
            cancel_at = stripe_sub.get('cancel_at')
            status = stripe_sub.get('status')
            
            print(f"DEBUG sub_updated: Checking cancellation...")
            print(f"DEBUG sub_updated: cancel_at_period_end={cancel_at_period_end} (type: {type(cancel_at_period_end)})")
            
            # Subscription is cancelled if cancel_at_period_end is True
            if cancel_at_period_end == True or str(cancel_at_period_end).lower() == 'true':
                print(f"DEBUG sub_updated: CANCELLATION DETECTED!")
                if not subscription.cancelled_at:
                    subscription.cancelled_at = timezone.now()
                    print(f"DEBUG sub_updated: Set cancelled_at to {subscription.cancelled_at}")
            elif canceled_at or cancel_at:
                print(f"DEBUG sub_updated: CANCELLATION DETECTED via canceled_at or cancel_at!")
                if not subscription.cancelled_at:
                    subscription.cancelled_at = timezone.now()
            else:
                print(f"DEBUG sub_updated: No cancellation, clearing cancelled_at")
                subscription.cancelled_at = None
            
            subscription.save()
            print(f"DEBUG sub_updated: SAVED - cancelled_at={subscription.cancelled_at}")
            
        except UserSubscription.DoesNotExist:
            print(f"DEBUG sub_updated: Subscription not found: {stripe_sub_id}")
        except Exception as e:
            print(f"DEBUG sub_updated: Error: {e}")
            import traceback
            traceback.print_exc()
        
              
    def _handle_subscription_deleted(self, stripe_sub):
        """Handle subscription deletion."""
        stripe_sub_id = stripe_sub.get('id')
        print(f"DEBUG sub_deleted: stripe_sub_id={stripe_sub_id}")
        
        try:
            subscription = UserSubscription.objects.get(stripe_subscription_id=stripe_sub_id)
            subscription.plan = UserSubscription.Plan.FREE
            subscription.stripe_subscription_id = None
            subscription.cancelled_at = timezone.now()
            subscription.save()
            print("DEBUG sub_deleted: Downgraded to free")
        except UserSubscription.DoesNotExist:
            print(f"DEBUG sub_deleted: Not found: {stripe_sub_id}")
    
    def _handle_payment_succeeded(self, invoice):
        """Handle successful payment."""
        subscription_id = invoice.get('subscription')
        if not subscription_id:
            return
        
        print(f"DEBUG payment_succeeded: subscription_id={subscription_id}")
        
        try:
            subscription = UserSubscription.objects.get(stripe_subscription_id=subscription_id)
            
            stripe_sub = stripe.Subscription.retrieve(subscription_id)
            stripe_sub_dict = dict(stripe_sub)
            
            current_period_end = self._get_period_end(stripe_sub_dict)
            if current_period_end:
                subscription.expires_at = datetime.fromtimestamp(current_period_end, tz=dt_tz.utc)
                subscription.save()
                print(f"DEBUG payment_succeeded: Updated expires_at to {subscription.expires_at}")
        
        except UserSubscription.DoesNotExist:
            print(f"DEBUG payment_succeeded: Not found: {subscription_id}")
    
    def _handle_payment_failed(self, invoice):
        """Handle failed payment."""
        subscription_id = invoice.get('subscription')
        print(f"DEBUG payment_failed: subscription_id={subscription_id}")
    
    def _update_payment_method(self, subscription, stripe_sub_dict):
        """Update payment method details."""
        try:
            default_pm = stripe_sub_dict.get('default_payment_method')
            
            if not default_pm:
                print("DEBUG payment_method: No default payment method")
                return
            
            if isinstance(default_pm, str):
                pm = stripe.PaymentMethod.retrieve(default_pm)
                pm_dict = dict(pm)
            else:
                pm_dict = dict(default_pm) if hasattr(default_pm, '__iter__') else default_pm
            
            subscription.stripe_payment_method_id = pm_dict.get('id')
            
            card = pm_dict.get('card', {})
            if card:
                subscription.stripe_card_last4 = card.get('last4')
                subscription.stripe_card_brand = card.get('brand')
                subscription.stripe_card_exp_month = card.get('exp_month')
                subscription.stripe_card_exp_year = card.get('exp_year')
                print(f"DEBUG payment_method: Updated card ending in {subscription.stripe_card_last4}")
        
        except Exception as e:
            print(f"DEBUG payment_method: Error: {e}")