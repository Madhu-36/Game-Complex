from django.test import TestCase
from django.core.cache import cache
from django.http import HttpRequest
from core.middleware.security_firewall import AdaptiveSecurityFirewall

class SecurityFirewallTest(TestCase):
    def setUp(self):
        self.middleware = AdaptiveSecurityFirewall(get_response=lambda r: "OK")
        # Ensure Redis cache is clear before testing
        cache.clear()

    def test_clean_request_passes(self):
        """
        Verify that a normal, non-malicious request passes through the firewall unaffected.
        """
        request = HttpRequest()
        request.META['REMOTE_ADDR'] = '192.168.1.1'
        request.path = '/api/store/checkout/'
        
        response = self.middleware(request)
        self.assertEqual(response, "OK")

    def test_sql_injection_detection(self):
        """
        Verify that common SQL injection payloads in the URL or body trigger the firewall
        and return a 403 Forbidden payload.
        """
        request = HttpRequest()
        request.META['REMOTE_ADDR'] = '10.0.0.5'
        request.path = '/api/store/products/?search=UNION SELECT * FROM users'
        
        response = self.middleware(request)
        self.assertEqual(response.status_code, 403)
        self.assertIn(b"Malicious payload detected", response.content)

    def test_xss_detection(self):
        """
        Verify that Cross-Site Scripting (XSS) attempts are caught and blocked.
        """
        request = HttpRequest()
        request.META['REMOTE_ADDR'] = '10.0.0.6'
        request.path = '/api/store/products/?search=<script>alert("hacked")</script>'
        
        response = self.middleware(request)
        self.assertEqual(response.status_code, 403)

    def test_ip_auto_ban_on_strikes(self):
        """
        Verify that 5 consecutive malicious requests result in a 1-hour IP ban,
        blocking even clean requests from that IP afterwards.
        """
        request = HttpRequest()
        request.META['REMOTE_ADDR'] = '10.0.0.7'
        request.path = '/api/store/?q=UNION SELECT'
        
        # Fire 5 malicious requests to trigger the auto-ban
        for _ in range(5):
            self.middleware(request)
            
        # 6th request (even if clean) should be blocked by the ban
        clean_request = HttpRequest()
        clean_request.META['REMOTE_ADDR'] = '10.0.0.7'
        clean_request.path = '/api/store/products/'
        
        response = self.middleware(clean_request)
        self.assertEqual(response.status_code, 403)
        self.assertIn(b"temporarily banned", response.content)
