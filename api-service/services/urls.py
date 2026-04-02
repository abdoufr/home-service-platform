from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.HealthCheckView.as_view(), name='health'),

    path('categories/', views.CategoryListView.as_view(), name='category_list'),
    path('categories/<slug:slug>/', views.CategoryDetailView.as_view(), name='category_detail'),

    path('admin/categories/', views.CategoryAdminView.as_view(), name='category_admin'),
    path('admin/categories/<int:pk>/', views.CategoryAdminDetailView.as_view(), name='category_admin_detail'),

    path('services/', views.ServiceListView.as_view(), name='service_list'),
    path('services/<int:pk>/', views.ServiceDetailView.as_view(), name='service_detail'),
    path('services/create/', views.ServiceCreateView.as_view(), name='service_create'),
    path('services/<int:pk>/update/', views.ServiceUpdateView.as_view(), name='service_update'),
    path('services/<int:pk>/delete/', views.ServiceDeleteView.as_view(), name='service_delete'),
    path('services/<int:service_id>/reviews/', views.ServiceReviewsView.as_view(), name='service_reviews'),

    path('provider/services/', views.ProviderServicesView.as_view(), name='provider_services'),
    path('provider/bookings/', views.ProviderBookingsView.as_view(), name='provider_bookings'),

    path('admin/services/', views.AdminServiceListView.as_view(), name='admin_services'),
    path('admin/services/<int:pk>/', views.AdminServiceDetailView.as_view(), name='admin_service_detail'),

    path('bookings/', views.ClientBookingsView.as_view(), name='client_bookings'),
    path('bookings/create/', views.BookingCreateView.as_view(), name='booking_create'),
    path('bookings/<int:pk>/', views.BookingDetailView.as_view(), name='booking_detail'),
    path('bookings/<int:pk>/status/', views.BookingStatusUpdateView.as_view(), name='booking_status'),

    path('admin/bookings/', views.AdminBookingListView.as_view(), name='admin_bookings'),
    path('admin/bookings/<int:pk>/', views.AdminBookingDetailView.as_view(), name='admin_booking_detail'),
    path('admin/bookings/<int:pk>/status/', views.AdminBookingStatusUpdateView.as_view(), name='admin_booking_status'),

    path('reviews/create/', views.ReviewCreateView.as_view(), name='review_create'),

    path('dashboard/stats/', views.DashboardStatsView.as_view(), name='dashboard_stats'),
]