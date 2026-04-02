from decimal import Decimal

from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, status, permissions, filters
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, Service, Booking, Review
from .serializers import (
    CategorySerializer, ServiceSerializer, ServiceCreateSerializer,
    BookingSerializer, BookingCreateSerializer, BookingStatusSerializer,
    ReviewSerializer, ReviewCreateSerializer
)
from .tasks import (
    send_booking_notification,
    send_status_update_notification,
    update_service_rating
)


# =========================
# Permissions personnalisées
# =========================

class IsProvider(permissions.BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'role') and request.user.role == 'PROVIDER'


class IsClient(permissions.BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'role') and request.user.role == 'CLIENT'


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'role') and request.user.role == 'ADMIN'


# =========================
# Health Check
# =========================

class HealthCheckView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({"status": "healthy", "service": "api-service"})


# =========================
# Catégories
# =========================

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class CategoryDetailView(generics.RetrieveAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class CategoryAdminView(generics.ListCreateAPIView):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]


class CategoryAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]


# =========================
# Services
# =========================

class ServiceListView(generics.ListAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'city', 'price_unit', 'is_available']
    search_fields = ['title', 'description', 'city', 'provider_name']
    ordering_fields = ['price', 'rating', 'created_at']

    def get_queryset(self):
        queryset = Service.objects.filter(is_available=True)
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')

        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        return queryset


class ServiceDetailView(generics.RetrieveAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.AllowAny]


class ServiceCreateView(generics.CreateAPIView):
    serializer_class = ServiceCreateSerializer
    permission_classes = [permissions.IsAuthenticated, IsProvider]

    def perform_create(self, serializer):
        serializer.save(
            provider_id=self.request.user.id,
            provider_name=self.request.user.username
        )


class ServiceUpdateView(generics.UpdateAPIView):
    serializer_class = ServiceCreateSerializer
    permission_classes = [permissions.IsAuthenticated, IsProvider]

    def get_queryset(self):
        return Service.objects.filter(provider_id=self.request.user.id)


class ServiceDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsProvider]

    def get_queryset(self):
        return Service.objects.filter(provider_id=self.request.user.id)


class ProviderServicesView(generics.ListAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated, IsProvider]

    def get_queryset(self):
        return Service.objects.filter(provider_id=self.request.user.id)


class AdminServiceListView(generics.ListAPIView):
    queryset = Service.objects.all().order_by('-created_at')
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]


class AdminServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]


# =========================
# Réservations
# =========================

class BookingCreateView(generics.CreateAPIView):
    serializer_class = BookingCreateSerializer
    permission_classes = [permissions.IsAuthenticated, IsClient]

    def perform_create(self, serializer):
        service = serializer.validated_data['service']
        duration = serializer.validated_data.get('duration_hours', Decimal('1.0'))

        if service.price_unit == 'HOUR':
            total = service.price * duration
        else:
            total = service.price

        booking = serializer.save(
            client_id=self.request.user.id,
            client_name=self.request.user.username,
            client_email=getattr(self.request.user, 'email', ''),
            provider_id=service.provider_id,
            total_price=total,
        )

        send_booking_notification.delay({
            'id': booking.id,
            'service_title': service.title,
            'client_name': booking.client_name,
            'client_email': booking.client_email,
            'provider_id': booking.provider_id,
            'scheduled_date': str(booking.scheduled_date),
            'scheduled_time': str(booking.scheduled_time),
            'total_price': str(booking.total_price),
            'address': booking.address,
        })


class ClientBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(client_id=self.request.user.id)


class ProviderBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated, IsProvider]

    def get_queryset(self):
        return Booking.objects.filter(provider_id=self.request.user.id)


class BookingDetailView(generics.RetrieveAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Booking.objects.filter(
            Q(client_id=user.id) | Q(provider_id=user.id)
        )


class BookingStatusUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        serializer = BookingStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            booking = Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            return Response(
                {"error": "Réservation introuvable."},
                status=status.HTTP_404_NOT_FOUND
            )

        user = request.user
        new_status = serializer.validated_data['status']

        if new_status == 'CANCELLED' and booking.client_id != user.id:
            if booking.provider_id != user.id:
                return Response(
                    {"error": "Non autorisé."},
                    status=status.HTTP_403_FORBIDDEN
                )

        if new_status in ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED']:
            if booking.provider_id != user.id and user.role != 'ADMIN':
                return Response(
                    {"error": "Seul le prestataire peut changer ce statut."},
                    status=status.HTTP_403_FORBIDDEN
                )

        booking.status = new_status
        booking.save()

        send_status_update_notification.delay(
            booking.id,
            new_status,
            booking.client_email
        )

        return Response(BookingSerializer(booking).data)


class AdminBookingListView(generics.ListAPIView):
    queryset = Booking.objects.all().order_by('-created_at')
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]


class AdminBookingDetailView(generics.RetrieveAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]


class AdminBookingStatusUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def patch(self, request, pk):
        serializer = BookingStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            booking = Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            return Response(
                {"error": "Réservation introuvable."},
                status=status.HTTP_404_NOT_FOUND
            )

        booking.status = serializer.validated_data['status']
        booking.save()

        send_status_update_notification.delay(
            booking.id,
            booking.status,
            booking.client_email
        )

        return Response(BookingSerializer(booking).data)


# =========================
# Avis
# =========================

class ReviewCreateView(generics.CreateAPIView):
    serializer_class = ReviewCreateSerializer
    permission_classes = [permissions.IsAuthenticated, IsClient]

    def perform_create(self, serializer):
        booking = serializer.validated_data['booking']

        if booking.client_id != self.request.user.id:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Ce n'est pas votre réservation.")

        if booking.status != 'COMPLETED':
            from rest_framework.exceptions import ValidationError
            raise ValidationError("La réservation doit être terminée.")

        serializer.save(
            service=booking.service,
            client_id=self.request.user.id,
            client_name=self.request.user.username,
        )

        update_service_rating.delay(booking.service.id)


class ServiceReviewsView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Review.objects.filter(service_id=self.kwargs['service_id'])


# =========================
# Dashboard
# =========================

class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role == 'PROVIDER':
            services_count = Service.objects.filter(provider_id=user.id).count()
            bookings = Booking.objects.filter(provider_id=user.id)
            return Response({
                'total_services': services_count,
                'total_bookings': bookings.count(),
                'pending_bookings': bookings.filter(status='PENDING').count(),
                'completed_bookings': bookings.filter(status='COMPLETED').count(),
                'revenue': sum(
                    float(b.total_price) for b in bookings.filter(status='COMPLETED')
                ),
            })

        if user.role == 'CLIENT':
            bookings = Booking.objects.filter(client_id=user.id)
            return Response({
                'total_bookings': bookings.count(),
                'pending_bookings': bookings.filter(status='PENDING').count(),
                'completed_bookings': bookings.filter(status='COMPLETED').count(),
            })

        if user.role == 'ADMIN':
            return Response({
                'total_services': Service.objects.count(),
                'total_bookings': Booking.objects.count(),
                'total_categories': Category.objects.count(),
                'pending_bookings': Booking.objects.filter(status='PENDING').count(),
            })

        return Response({"error": "Rôle inconnu"}, status=400)