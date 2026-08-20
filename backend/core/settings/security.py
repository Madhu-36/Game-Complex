"""
Production Security Hardening Settings
To be imported into the main settings.py file for production deployment.
"""

# -----------------------------------------------------------------------------
# 1. SECURE TRANSPORT (HTTPS/HSTS)
# -----------------------------------------------------------------------------
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000  # 1 year (instructs browsers to always use HTTPS)
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# -----------------------------------------------------------------------------
# 2. SECURE COOKIES
# -----------------------------------------------------------------------------
# Prevents cookies from being transmitted over unencrypted HTTP connections
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# HttpOnly prevents JavaScript (XSS attacks) from reading the cookies
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = True

# -----------------------------------------------------------------------------
# 3. CLICKJACKING & MIME-SNIFFING PROTECTION
# -----------------------------------------------------------------------------
# Prevents the site from being embedded in an iframe (mitigates clickjacking)
X_FRAME_OPTIONS = 'DENY'

# Prevents the browser from guessing the content type, forcing it to stick to the declared type
SECURE_CONTENT_TYPE_NOSNIFF = True

# -----------------------------------------------------------------------------
# 4. CROSS-ORIGIN RESOURCE SHARING (CORS)
# -----------------------------------------------------------------------------
# Strict configuration allowing only the official Vite React frontend to access the API
CORS_ALLOWED_ORIGINS = [
    "https://www.gamecomplex.com",
    "https://gamecomplex.com",
    # "http://localhost:5173", # Uncomment for local development
]

# -----------------------------------------------------------------------------
# 5. CONTENT SECURITY POLICY (CSP)
# -----------------------------------------------------------------------------
# Requires 'django-csp' package. Prevents unauthorized scripts, styles, or iframes from loading.
CSP_DEFAULT_SRC = ("'self'",)
# Allow Stripe JS for payment processing
CSP_SCRIPT_SRC = ("'self'", "https://js.stripe.com") 
# Allow Stripe Elements iframe to render the credit card input securely
CSP_FRAME_SRC = ("'self'", "https://js.stripe.com") 
# Allow inline styles for React/Tailwind runtime CSS injections
CSP_STYLE_SRC = ("'self'", "'unsafe-inline'") 
# Allow external images from trusted CDNs and data URIs (base64)
CSP_IMG_SRC = ("'self'", "data:", "https://res.cloudinary.com", "https://loremflickr.com")
