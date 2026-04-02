from rest_framework import serializers
from .models import Category, Service, Booking, Review


class CategorySerializer(serializers.ModelSerializer):
    services_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description',
            'icon', 'is_active', 'services_count'
        ]

    def get_services_count(self, obj):
        return obj.services.filter(is_available=True).count()


class ServiceSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source='category.name', read_only=True
    )

    class Meta:
        model = Service
        fields = [
            'id', 'title', 'description', 'category', 'category_name',
            'provider_id', 'provider_name', 'price', 'price_unit',
            'city', 'address', 'image', 'rating', 'total_reviews',
            'is_available', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'provider_id', 'provider_name',
            'rating', 'total_reviews', 'created_at', 'updated_at'
        ]


class ServiceCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            'title', 'description', 'category', 'price',
            'price_unit', 'city', 'address', 'image'
        ]


class BookingSerializer(serializers.ModelSerializer):
    service_title = serializers.CharField(
        source='service.title', read_only=True
    )
    status_display = serializers.CharField(
        source='get_status_display', read_only=True
    )

    class Meta:
        model = Booking
        fields = [
            'id', 'service', 'service_title', 'client_id', 'client_name',
            'client_email', 'provider_id', 'scheduled_date',
            'scheduled_time', 'duration_hours', 'total_price', 'address',
            'notes', 'status', 'status_display', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'client_id', 'client_name', 'client_email',
            'provider_id', 'total_price', 'created_at', 'updated_at'
        ]


class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            'service', 'scheduled_date', 'scheduled_time',
            'duration_hours', 'address', 'notes'
        ]


class BookingStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Booking.Status.choices)


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            'id', 'booking', 'service', 'client_id', 'client_name',
            'rating', 'comment', 'created_at'
        ]
        read_only_fields = [
            'id', 'service', 'client_id', 'client_name', 'created_at'
        ]


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['booking', 'rating', 'comment']