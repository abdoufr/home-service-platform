from django.contrib import admin
from .models import Category, Service, Booking, Review

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active', 'created_at')
    prepopulated_fields = {'slug': ('name',)}
    list_filter = ('is_active',)
    search_fields = ('name',)

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'provider_name', 'category', 'price', 'is_available', 'created_at')
    list_filter = ('is_available', 'category')
    search_fields = ('title', 'provider_name')

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'service', 'client_name', 'provider_id', 'scheduled_date', 'status', 'total_price', 'created_at')
    list_filter = ('status', 'scheduled_date')
    search_fields = ('client_name', 'client_email', 'service__title')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'service', 'client_name', 'rating', 'created_at')
    list_filter = ('rating',)
    search_fields = ('client_name', 'service__title', 'comment')
