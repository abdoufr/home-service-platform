import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
};

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/bookings/');
            setBookings(res.data.results || res.data);
        } catch (error) {
            toast.error("Erreur chargement réservations");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/admin/bookings/${id}/status/`, { status });
            toast.success('Statut mis à jour');
            fetchBookings();
        } catch (error) {
            toast.error("Erreur mise à jour statut");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Gestion des réservations</h1>

            {loading ? (
                <div className="text-center py-10">Chargement...</div>
            ) : (
                <div className="space-y-4">
                    {bookings.map(booking => (
                        <div key={booking.id} className="bg-white rounded-xl shadow p-6">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="text-lg font-semibold">{booking.service_title}</h3>
                                    <p className="text-sm text-gray-500">Réservation #{booking.id}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm ${statusColors[booking.status]}`}>
                                    {booking.status_display}
                                </span>
                            </div>

                            <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                                <p><strong>Client :</strong> {booking.client_name}</p>
                                <p><strong>Email :</strong> {booking.client_email}</p>
                                <p><strong>Date :</strong> {booking.scheduled_date}</p>
                                <p><strong>Heure :</strong> {booking.scheduled_time}</p>
                                <p><strong>Total :</strong> {booking.total_price} DA</p>
                                <p><strong>Adresse :</strong> {booking.address}</p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => updateStatus(booking.id, 'PENDING')}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                                >
                                    Pending
                                </button>
                                <button
                                    onClick={() => updateStatus(booking.id, 'CONFIRMED')}
                                    className="bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    Confirmed
                                </button>
                                <button
                                    onClick={() => updateStatus(booking.id, 'IN_PROGRESS')}
                                    className="bg-purple-600 text-white px-4 py-2 rounded"
                                >
                                    In Progress
                                </button>
                                <button
                                    onClick={() => updateStatus(booking.id, 'COMPLETED')}
                                    className="bg-green-600 text-white px-4 py-2 rounded"
                                >
                                    Completed
                                </button>
                                <button
                                    onClick={() => updateStatus(booking.id, 'CANCELLED')}
                                    className="bg-red-600 text-white px-4 py-2 rounded"
                                >
                                    Cancelled
                                </button>
                            </div>
                        </div>
                    ))}

                    {bookings.length === 0 && (
                        <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
                            Aucune réservation trouvée
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminBookings;