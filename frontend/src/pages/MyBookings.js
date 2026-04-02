import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';

const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
};

const MyBookings = () => {
    const { isProvider } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const endpoint = isProvider ? '/provider/bookings/' : '/bookings/';
            const res = await api.get(endpoint);
            setBookings(res.data.results || res.data);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            await api.patch(`/bookings/${id}/status/`, { status: newStatus });
            toast.success('Statut mis à jour !');
            fetchBookings();
        } catch (error) {
            toast.error('Erreur lors de la mise à jour.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">
                {isProvider ? 'Réservations reçues' : 'Mes réservations'}
            </h1>

            {bookings.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    <FiCalendar size={48} className="mx-auto mb-4" />
                    <p className="text-xl">Aucune réservation</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map(booking => (
                        <div key={booking.id} className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="text-lg font-semibold">{booking.service_title}</h3>
                                    <p className="text-gray-500 text-sm">
                                        {isProvider ? `Client: ${booking.client_name}` : `Réservation #${booking.id}`}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[booking.status]}`}>
                                    {booking.status_display}
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                                <div className="flex items-center">
                                    <FiCalendar className="mr-2" /> {booking.scheduled_date}
                                </div>
                                <div className="flex items-center">
                                    <FiClock className="mr-2" /> {booking.scheduled_time}
                                </div>
                                <div className="flex items-center">
                                    <FiMapPin className="mr-2" /> {booking.address?.substring(0, 30)}...
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-3 border-t">
                                <span className="text-xl font-bold text-blue-600">
                                    {booking.total_price} DA
                                </span>

                                <div className="flex gap-2">
                                    {isProvider && booking.status === 'PENDING' && (
                                        <>
                                            <button
                                                onClick={() => updateStatus(booking.id, 'CONFIRMED')}
                                                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
                                            >
                                                Accepter
                                            </button>
                                            <button
                                                onClick={() => updateStatus(booking.id, 'CANCELLED')}
                                                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
                                            >
                                                Refuser
                                            </button>
                                        </>
                                    )}
                                    {isProvider && booking.status === 'CONFIRMED' && (
                                        <button
                                            onClick={() => updateStatus(booking.id, 'IN_PROGRESS')}
                                            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm"
                                        >
                                            Démarrer
                                        </button>
                                    )}
                                    {isProvider && booking.status === 'IN_PROGRESS' && (
                                        <button
                                            onClick={() => updateStatus(booking.id, 'COMPLETED')}
                                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                                        >
                                            Terminer
                                        </button>
                                    )}
                                    {!isProvider && booking.status === 'PENDING' && (
                                        <button
                                            onClick={() => updateStatus(booking.id, 'CANCELLED')}
                                            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                                        >
                                            Annuler
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;