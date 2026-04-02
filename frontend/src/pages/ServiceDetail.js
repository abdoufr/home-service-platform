import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiStar, FiMapPin, FiUser, FiCalendar } from 'react-icons/fi';

const ServiceDetail = () => {
    const { id } = useParams();
    const { isAuthenticated, isClient } = useAuth();
    const [service, setService] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [serviceRes, reviewsRes] = await Promise.all([
                    api.get(`/services/${id}/`),
                    api.get(`/services/${id}/reviews/`),
                ]);
                setService(serviceRes.data);
                setReviews(reviewsRes.data.results || reviewsRes.data);
            } catch (error) {
                console.error('Erreur:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!service) return <div className="text-center py-20">Service introuvable</div>;

    const priceLabel = { HOUR: '/heure', FIXED: ' (forfait)', SQMETER: '/m²' };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="h-64 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                    {service.image ? (
                        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-8xl text-white">🏠</span>
                    )}
                </div>

                <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                                {service.category_name}
                            </span>
                            <h1 className="text-3xl font-bold mt-2">{service.title}</h1>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold text-blue-600">
                                {service.price} DA
                                <span className="text-sm text-gray-400">{priceLabel[service.price_unit]}</span>
                            </p>
                        </div>
                    </div>

                    <p className="text-gray-600 mb-6">{service.description}</p>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="flex items-center text-gray-500">
                            <FiMapPin className="mr-2" /> {service.city}
                        </div>
                        <div className="flex items-center text-gray-500">
                            <FiUser className="mr-2" /> {service.provider_name}
                        </div>
                        <div className="flex items-center text-gray-500">
                            <FiStar className="mr-2 text-yellow-400" />
                            {service.rating} ({service.total_reviews} avis)
                        </div>
                    </div>

                    {isAuthenticated && isClient ? (
                        <Link
                            to={`/bookings/new?service=${service.id}`}
                            className="block w-full bg-blue-600 text-white text-center py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition"
                        >
                            <FiCalendar className="inline mr-2" /> Réserver maintenant
                        </Link>
                    ) : !isAuthenticated ? (
                        <Link
                            to="/login"
                            className="block w-full bg-gray-100 text-gray-600 text-center py-4 rounded-xl"
                        >
                            Connectez-vous pour réserver
                        </Link>
                    ) : null}
                </div>
            </div>

            {/* Avis */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Avis ({reviews.length})</h2>
                {reviews.length > 0 ? (
                    <div className="space-y-4">
                        {reviews.map(review => (
                            <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold">{review.client_name}</span>
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <FiStar
                                                key={i}
                                                className={`${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Aucun avis pour le moment.</p>
                )}
            </div>
        </div>
    );
};

export default ServiceDetail;