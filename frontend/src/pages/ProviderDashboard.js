import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { FiPlus, FiPackage, FiCalendar, FiDollarSign, FiCheckCircle } from 'react-icons/fi';

const ProviderDashboard = () => {
    const [stats, setStats] = useState(null);
    const [services, setServices] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, servicesRes, bookingsRes] = await Promise.all([
                api.get('/dashboard/stats/'),
                api.get('/provider/services/'),
                api.get('/provider/bookings/'),
            ]);
            setStats(statsRes.data);
            setServices(servicesRes.data.results || servicesRes.data);
            setBookings(bookingsRes.data.results || bookingsRes.data);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.patch(`/bookings/${id}/status/`, { status: newStatus });
            fetchData(); // Refresh list after update
        } catch (error) {
            console.error('Erreur:', error);
            alert("Erreur lors de la mise à jour du statut.");
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
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Dashboard Prestataire</h1>
                <Link
                    to="/services/new"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center"
                >
                    <FiPlus className="mr-2" /> Nouveau service
                </Link>
            </div>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { icon: <FiPackage />, label: 'Services', value: stats.total_services, color: 'blue' },
                        { icon: <FiCalendar />, label: 'Réservations', value: stats.total_bookings, color: 'purple' },
                        { icon: <FiCheckCircle />, label: 'Terminées', value: stats.completed_bookings, color: 'green' },
                        { icon: <FiDollarSign />, label: 'Revenus', value: `${stats.revenue || 0} DA`, color: 'yellow' },
                    ].map((stat, i) => (
                        <div key={i} className={`bg-white rounded-xl shadow-sm p-6`}>
                            <div className={`text-${stat.color}-600 text-2xl mb-2`}>{stat.icon}</div>
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-gray-500 text-sm">{stat.label}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Mes services */}
            <h2 className="text-2xl font-bold mb-4">Mes services</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
                {services.map(service => (
                    <div key={service.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                        <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                        <p className="text-gray-500 text-sm mb-3">{service.category_name}</p>
                        <div className="flex justify-between items-center">
                            <span className="text-blue-600 font-bold">{service.price} DA</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${service.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {service.is_available ? 'Actif' : 'Inactif'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mes réservations */}
            <h2 className="text-2xl font-bold mb-4">Réservations récentes</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Heure</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {bookings.map(booking => (
                            <tr key={booking.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{booking.service_title}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{booking.client_name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{booking.scheduled_date}</div>
                                    <div className="text-xs text-gray-500">{booking.scheduled_time}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                                    {booking.total_price} DA
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                        booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                        booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                        'bg-blue-100 text-blue-800'
                                    }`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <select
                                        className="text-gray-600 bg-gray-100 border-none rounded p-1 text-xs focus:ring-2 focus:ring-blue-500"
                                        value={booking.status}
                                        onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                                        disabled={booking.status === 'COMPLETED' || booking.status === 'CANCELLED'}
                                    >
                                        <option value="PENDING">En attente</option>
                                        <option value="CONFIRMED">Confirmer</option>
                                        <option value="IN_PROGRESS">En cours</option>
                                        <option value="COMPLETED">Terminé</option>
                                        <option value="CANCELLED">Annuler</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {bookings.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                        Aucune réservation pour le moment.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProviderDashboard;