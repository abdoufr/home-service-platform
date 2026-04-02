import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const BookingForm = () => {
    const [searchParams] = useSearchParams();
    const serviceId = searchParams.get('service');
    const [service, setService] = useState(null);
    const [formData, setFormData] = useState({
        service: serviceId,
        scheduled_date: '',
        scheduled_time: '',
        duration_hours: 1,
        address: '',
        notes: '',
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (serviceId) {
            api.get(`/services/${serviceId}/`).then(res => setService(res.data));
        }
    }, [serviceId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/bookings/create/', formData);
            toast.success('Réservation créée avec succès !');
            navigate('/bookings');
        } catch (error) {
            const msg = error.response?.data?.detail || 'Erreur lors de la réservation.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Nouvelle réservation</h1>

            {service && (
                <div className="bg-blue-50 rounded-xl p-6 mb-6">
                    <h3 className="font-semibold text-lg">{service.title}</h3>
                    <p className="text-gray-600">{service.provider_name} — {service.city}</p>
                    <p className="text-blue-600 font-bold text-xl mt-2">{service.price} DA</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                        <input
                            type="date"
                            required
                            value={formData.scheduled_date}
                            onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Heure *</label>
                        <input
                            type="time"
                            required
                            value={formData.scheduled_time}
                            onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Durée (heures)</label>
                    <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={formData.duration_hours}
                        onChange={(e) => setFormData({ ...formData, duration_hours: parseFloat(e.target.value) })}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse d'intervention *</label>
                    <textarea
                        required
                        rows="2"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Adresse complète..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                        rows="3"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Précisions sur l'intervention..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
                >
                    {loading ? 'Réservation...' : 'Confirmer la réservation'}
                </button>
            </form>
        </div>
    );
};

export default BookingForm;