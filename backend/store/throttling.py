from rest_framework.throttling import SimpleRateThrottle

class AnonCheckoutThrottle(SimpleRateThrottle):
    """
    Limits unauthenticated checkout attempts to 3 per minute.
    Mitigates automated card testing and spam cart creation.
    """
    scope = 'anon_checkout'
    rate = '3/m'

    def get_cache_key(self, request, view):
        if request.user.is_authenticated:
            return None  # Only throttle anonymous users here
        return self.cache_format % {
            'scope': self.scope,
            'ident': self.get_ident(request)
        }

class LoginBurstThrottle(SimpleRateThrottle):
    """
    Limits login attempts to 5 per minute per IP.
    Mitigates credential stuffing and brute-force password attacks.
    """
    scope = 'login_burst'
    rate = '5/m'

    def get_cache_key(self, request, view):
        return self.cache_format % {
            'scope': self.scope,
            'ident': self.get_ident(request)
        }

class KeyRedemptionThrottle(SimpleRateThrottle):
    """
    Limits digital key access/redemption endpoints to 10 per minute.
    Blocks automated key enumeration and scraping bots.
    """
    scope = 'key_redemption'
    rate = '10/m'

    def get_cache_key(self, request, view):
        if request.user.is_authenticated:
            ident = request.user.pk
        else:
            ident = self.get_ident(request)

        return self.cache_format % {
            'scope': self.scope,
            'ident': ident
        }
