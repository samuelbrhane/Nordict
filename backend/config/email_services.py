# config/email_service.py

from django.core.mail import send_mail, EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string


class EmailService:
    """Centralized email service for Nordict."""
    
    FROM_EMAIL = settings.DEFAULT_FROM_EMAIL  # alerts@nordict.net
    
    # ==========================================================================
    # Password Reset
    # ==========================================================================
    
    @staticmethod
    def send_password_reset(user, reset_url):
        """Send password reset email."""
        subject = "Reset your Nordict password"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ text-align: center; padding: 20px 0; border-bottom: 2px solid #04EC3A; }}
                .logo {{ font-size: 28px; font-weight: bold; color: #04EC3A; }}
                .content {{ padding: 30px 0; }}
                .button {{ display: inline-block; background-color: #04EC3A; color: #000; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }}
                .footer {{ text-align: center; padding: 20px 0; color: #666; font-size: 12px; border-top: 1px solid #eee; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">Nordict</div>
                </div>
                <div class="content">
                    <h2>Reset your password</h2>
                    <p>Hi {user.first_name or 'there'},</p>
                    <p>We received a request to reset your password. Click the button below to create a new password:</p>
                    <p style="text-align: center;">
                        <a href="{reset_url}" class="button">Reset Password</a>
                    </p>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you didn't request this, you can safely ignore this email.</p>
                </div>
                <div class="footer">
                    <p>© 2026 Nordict. All rights reserved.</p>
                    <p>Cryptocurrency forecasting with confidence.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        Reset your Nordict password
        
        Hi {user.first_name or 'there'},
        
        We received a request to reset your password. Click the link below to create a new password:
        
        {reset_url}
        
        This link will expire in 1 hour.
        
        If you didn't request this, you can safely ignore this email.
        
        - The Nordict Team
        """
        
        return EmailService._send_email(
            subject=subject,
            text_content=text_content,
            html_content=html_content,
            to_email=user.email
        )
    
    # ==========================================================================
    # Price Alerts
    # ==========================================================================
    
    @staticmethod
    def send_price_alert(user, alert, forecast, trigger_reason):
        """Send price alert notification."""
        market = alert.market
        subject = f"🚀 {market.symbol} Alert: {trigger_reason}"
        
        # Determine direction emoji and color
        direction_emoji = "📈" if forecast.direction == "up" else "📉" if forecast.direction == "down" else "➡️"
        direction_text = forecast.direction.capitalize()
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ text-align: center; padding: 20px 0; border-bottom: 2px solid #04EC3A; }}
                .logo {{ font-size: 28px; font-weight: bold; color: #04EC3A; }}
                .content {{ padding: 30px 0; }}
                .alert-box {{ background: #f8f9fa; border-radius: 12px; padding: 20px; margin: 20px 0; }}
                .market-name {{ font-size: 24px; font-weight: bold; color: #000; }}
                .price {{ font-size: 32px; font-weight: bold; color: #04EC3A; }}
                .stat {{ display: inline-block; margin: 10px 20px 10px 0; }}
                .stat-label {{ font-size: 12px; color: #666; text-transform: uppercase; }}
                .stat-value {{ font-size: 18px; font-weight: 600; }}
                .button {{ display: inline-block; background-color: #04EC3A; color: #000; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }}
                .footer {{ text-align: center; padding: 20px 0; color: #666; font-size: 12px; border-top: 1px solid #eee; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">Nordict</div>
                </div>
                <div class="content">
                    <h2>{direction_emoji} {market.symbol} Alert Triggered</h2>
                    <p>Hi {user.first_name or 'there'},</p>
                    <p>Your alert for <strong>{market.symbol}</strong> has been triggered:</p>
                    
                    <div class="alert-box">
                        <div class="market-name">{market.name} ({market.symbol})</div>
                        <div class="price">${forecast.current_price:,.2f}</div>
                        <div style="margin-top: 15px;">
                            <div class="stat">
                                <div class="stat-label">Direction</div>
                                <div class="stat-value">{direction_emoji} {direction_text}</div>
                            </div>
                            <div class="stat">
                                <div class="stat-label">Confidence</div>
                                <div class="stat-value">{forecast.confidence_score:.0%}</div>
                            </div>
                            <div class="stat">
                                <div class="stat-label">Horizon</div>
                                <div class="stat-value">{alert.horizon}</div>
                            </div>
                        </div>
                        <div style="margin-top: 15px;">
                            <div class="stat">
                                <div class="stat-label">Predicted Range</div>
                                <div class="stat-value">${forecast.predicted_low:,.2f} - ${forecast.predicted_high:,.2f}</div>
                            </div>
                        </div>
                    </div>
                    
                    <p style="text-align: center;">
                        <a href="https://nordict.net/app/markets/{market.symbol}" class="button">View Full Forecast</a>
                    </p>
                </div>
                <div class="footer">
                    <p>You received this because you enabled alerts for {market.symbol}.</p>
                    <p><a href="https://nordict.net/app/alerts">Manage your alerts</a></p>
                    <p>© 2026 Nordict. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        {market.symbol} Alert Triggered
        
        Hi {user.first_name or 'there'},
        
        Your alert for {market.symbol} has been triggered.
        
        {market.name} ({market.symbol})
        Current Price: ${forecast.current_price:,.2f}
        Direction: {direction_text}
        Confidence: {forecast.confidence_score:.0%}
        Predicted Range: ${forecast.predicted_low:,.2f} - ${forecast.predicted_high:,.2f}
        
        View full forecast: https://nordict.net/app/markets/{market.symbol}
        
        - The Nordict Team
        
        Manage your alerts: https://nordict.net/app/alerts
        """
        
        return EmailService._send_email(
            subject=subject,
            text_content=text_content,
            html_content=html_content,
            to_email=user.email
        )
    
    # ==========================================================================
    # Welcome Email
    # ==========================================================================
    
    @staticmethod
    def send_welcome_email(user):
        """Send welcome email to new users."""
        subject = "Welcome to Nordict! 🚀"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ text-align: center; padding: 20px 0; border-bottom: 2px solid #04EC3A; }}
                .logo {{ font-size: 28px; font-weight: bold; color: #04EC3A; }}
                .content {{ padding: 30px 0; }}
                .feature {{ margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; }}
                .button {{ display: inline-block; background-color: #04EC3A; color: #000; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }}
                .footer {{ text-align: center; padding: 20px 0; color: #666; font-size: 12px; border-top: 1px solid #eee; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">Nordict</div>
                </div>
                <div class="content">
                    <h2>Welcome to Nordict! 🎉</h2>
                    <p>Hi {user.first_name or 'there'},</p>
                    <p>Thanks for signing up! You now have access to cryptocurrency forecasts with calibrated confidence bands.</p>
                    
                    <div class="feature">
                        <strong>📊 Multi-horizon forecasts</strong><br>
                        Get predictions for 24 hours, 30 days, 12 weeks, and 12 months.
                    </div>
                    
                    <div class="feature">
                        <strong>🔔 Smart alerts</strong><br>
                        Set up alerts to get notified when forecasts change.
                    </div>
                    
                    <div class="feature">
                        <strong>📈 Performance tracking</strong><br>
                        See how our predictions compare to actual prices.
                    </div>
                    
                    <p style="text-align: center;">
                        <a href="https://nordict.net/app/dashboard" class="button">Go to Dashboard</a>
                    </p>
                </div>
                <div class="footer">
                    <p>© 2026 Nordict. All rights reserved.</p>
                    <p>Cryptocurrency forecasting with confidence.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        Welcome to Nordict!
        
        Hi {user.first_name or 'there'},
        
        Thanks for signing up! You now have access to cryptocurrency forecasts with calibrated confidence bands.
        
        What you can do:
        - View multi-horizon forecasts (24H, 30D, 12W, 12M)
        - Set up smart alerts for price changes
        - Track prediction performance
        
        Go to your dashboard: https://nordict.net/app/dashboard
        
        - The Nordict Team
        """
        
        return EmailService._send_email(
            subject=subject,
            text_content=text_content,
            html_content=html_content,
            to_email=user.email
        )
    
    # ==========================================================================
    # Email Verification
    # ==========================================================================
    
    @staticmethod
    def send_email_verification(user, verification_url):
        """Send email verification link."""
        subject = "Verify your Nordict email"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ text-align: center; padding: 20px 0; border-bottom: 2px solid #04EC3A; }}
                .logo {{ font-size: 28px; font-weight: bold; color: #04EC3A; }}
                .content {{ padding: 30px 0; }}
                .button {{ display: inline-block; background-color: #04EC3A; color: #000; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }}
                .footer {{ text-align: center; padding: 20px 0; color: #666; font-size: 12px; border-top: 1px solid #eee; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">Nordict</div>
                </div>
                <div class="content">
                    <h2>Verify your email</h2>
                    <p>Hi {user.first_name or 'there'},</p>
                    <p>Please verify your email address by clicking the button below:</p>
                    <p style="text-align: center;">
                        <a href="{verification_url}" class="button">Verify Email</a>
                    </p>
                    <p>This link will expire in 24 hours.</p>
                </div>
                <div class="footer">
                    <p>© 2026 Nordict. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        Verify your Nordict email
        
        Hi {user.first_name or 'there'},
        
        Please verify your email address by clicking the link below:
        
        {verification_url}
        
        This link will expire in 24 hours.
        
        - The Nordict Team
        """
        
        return EmailService._send_email(
            subject=subject,
            text_content=text_content,
            html_content=html_content,
            to_email=user.email
        )
    
    # ==========================================================================
    # Helper Method
    # ==========================================================================
    
    @staticmethod
    def _send_email(subject, text_content, html_content, to_email):
        """Send email with both text and HTML content."""
        try:
            email = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=EmailService.FROM_EMAIL,
                to=[to_email]
            )
            email.attach_alternative(html_content, "text/html")
            email.send(fail_silently=False)
            return True
        except Exception as e:
            print(f"Failed to send email to {to_email}: {e}")
            return False