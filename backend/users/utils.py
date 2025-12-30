from user_agents import parse


def get_client_info(request):
    """Extract device info from request."""
    
    # Get user agent
    user_agent_string = request.META.get('HTTP_USER_AGENT', '')
    user_agent = parse(user_agent_string)
    
    # Get IP address
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip_address = x_forwarded_for.split(',')[0].strip()
    else:
        ip_address = request.META.get('REMOTE_ADDR')
    
    # Build device string
    if user_agent.is_mobile:
        device = f"{user_agent.browser.family} on {user_agent.os.family}"
    elif user_agent.is_tablet:
        device = f"{user_agent.browser.family} on {user_agent.device.family}"
    else:
        device = f"{user_agent.browser.family} on {user_agent.os.family}"
    
    return {
        'device': device,
        'browser': user_agent.browser.family,
        'os': user_agent.os.family,
        'ip_address': ip_address,
    }


def get_location_from_ip(ip_address):
    """Get location from IP address (basic implementation)."""
    # For production, use a service like:
    # - ipinfo.io
    # - ip-api.com
    # - MaxMind GeoIP
    
    # For now, return empty
    # You can implement this later with an API call
    return ""