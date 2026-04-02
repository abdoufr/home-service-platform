from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('health/', views.HealthCheckView.as_view(), name='health'),

    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('validate/', views.ValidateTokenView.as_view(), name='validate_token'),

    path('profile/', views.ProfileView.as_view(), name='profile'),

    path('users/', views.UserListView.as_view(), name='user_list'),
    path('users/<int:pk>/', views.UserAdminDetailView.as_view(), name='user_admin_detail'),
]