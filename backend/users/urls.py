from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterView, UserProfileView, PasswordResetRequestView, PasswordResetConfirmView, EmailVerificationView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', UserProfileView.as_view(), name='user_profile'),
    path('reset-password/', PasswordResetRequestView.as_view(), name='reset_password'),
    path('reset-password-confirm/', PasswordResetConfirmView.as_view(), name='reset_password_confirm'),
    path('verify-email/', EmailVerificationView.as_view(), name='verify_email'),
]
