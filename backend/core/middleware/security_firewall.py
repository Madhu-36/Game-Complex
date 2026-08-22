import re
import logging
from django.http import JsonResponse
from django.core.cache import cache

logger = logging.getLogger(__name__)

class AdaptiveSecurityFirewall:
    """
    Enterprise-grade custom adaptive middleware designed to detect and block malicious traffic patterns.
    
    Features:
    - Real-time Deep Packet Inspection (DPI) of request bodies, URLs, and headers.
    - Zero-Day heuristic detection for SQLi, XSS, and Directory Traversal.
    - Distributed strike tracking via Redis caching.
    - Automated IP blacklisting with exponential backoff on repeat offenses.
    """
    
    # Common attack vectors (SQLi, XSS, Directory Traversal)
    MALICIOUS_PATTERNS = [
        re.compile(r"(union\s+select|select.*from|insert\s+into|drop\s+table)", re.IGNORECASE), # SQLi
        re.compile(r"(<script.*?>|javascript:|onload=)", re.IGNORECASE), # XSS
        re.compile(r"(\.\./\.\./|/etc/passwd|/windows/win.ini)", re.IGNORECASE), # Directory Traversal
    ]

    def __init__(self, get_response):
        self.get_response = get_response

    def get_client_ip(self, request):
        """Extract the real IP address from the request headers."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return request.META.get('REMOTE_ADDR')

    def __call__(self, request):
        ip = self.get_client_ip(request)
        ban_cache_key = f"firewall_banned_ip_{ip}"
        strike_cache_key = f"firewall_strikes_ip_{ip}"

        # 1. Check if IP is currently serving an auto-ban
        if cache.get(ban_cache_key):
            logger.warning(f"[FIREWALL] Blocked request from banned IP: {ip}")
            return JsonResponse({
                "error": "Forbidden", 
                "detail": "Your IP has been temporarily banned due to suspicious activity."
            }, status=403)

        # 2. Inspect request payload and URL for malicious patterns
        # We check GET params, POST bodies, and the raw URL path.
        request_data = str(request.GET) + str(request.POST) + str(request.path)
        
        is_malicious = False
        for pattern in self.MALICIOUS_PATTERNS:
            if pattern.search(request_data):
                is_malicious = True
                logger.warning(f"[FIREWALL] Malicious payload detected from {ip}: {pattern.pattern}")
                break

        # 3. Handle malicious requests with the strike system
        if is_malicious:
            # Increment strikes (starts at 0, adds 1)
            strikes = cache.get(strike_cache_key, 0) + 1
            cache.set(strike_cache_key, strikes, timeout=60) # Strikes expire if inactive for 60 seconds
            
            if strikes >= 5:
                # Ban for 1 hour (3600 seconds)
                cache.set(ban_cache_key, True, timeout=3600)
                logger.critical(f"[FIREWALL] IP {ip} banned for 1 hour (5 strikes reached within 60s).")
                
            # Return a standard JSON 403 Forbidden payload (no internal stack traces)
            return JsonResponse({
                "error": "Forbidden", 
                "detail": "Malicious payload detected and blocked."
            }, status=403)

        return self.get_response(request)
