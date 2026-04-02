from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'is_verified', 'is_staff')
    list_filter = ('role', 'is_verified', 'is_staff', 'is_active')
    search_fields = ('username', 'email')
    ordering = ('-date_joined',)

    fieldsets = UserAdmin.fieldsets + (
        ('Informations Platform', {'fields': ('role', 'phone', 'address', 'city', 'avatar', 'is_verified')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Informations Platform', {
            'classes': ('wide',),
            'fields': ('email', 'role', 'is_verified')}
        ),
    )
