import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ServiceCard from '../components/ServiceCard';
import { FiSearch, FiShield, FiClock, FiStar } from 'react-icons/fi';

const Home = () => {
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [servicesRes, categoriesRes] = await Promise.all([
                    api.get('/services/?page_size=6'),
                    api.get('/categories/'),
                ]);
                setServices(Array.isArray(servicesRes.data.results) ? servicesRes.data.results : (Array.isArray(servicesRes.data) ? servicesRes.data : []));
                setCategories(Array.isArray(categoriesRes.data.results) ? categoriesRes.data.results : (Array.isArray(categoriesRes.data) ? categoriesRes.data : []));
            } catch (error) {
                console.error('Erreur chargement:', error);
                setServices([]);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            {/* Hero */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-6">
                        Services à domicile de confiance
                    </h1>
                    <p className="text-xl mb-8 text-blue-100">
                        Trouvez des professionnels qualifiés pour tous vos besoins :
                        plomberie, électricité, ménage, jardinage et plus encore.
                    </p>
                    <Link
                        to="/services"
                        className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition inline-flex items-center"
                    >
                        <FiSearch className="mr-2" /> Explorer les services
                    </Link>
                </div>
            </section>

            {/* Points forts */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
                    {[
                        { icon: <FiShield size={40} />, title: 'Professionnels vérifiés', desc: 'Tous nos prestataires sont validés et évalués.' },
                        { icon: <FiClock size={40} />, title: 'Réservation rapide', desc: 'Réservez en quelques clics, 24h/24.' },
                        { icon: <FiStar size={40} />, title: 'Avis authentiques', desc: 'Des avis réels de clients satisfaits.' },
                    ].map((item, idx) => (
                        <div key={idx} className="text-center p-6">
                            <div className="text-blue-600 flex justify-center mb-4">{item.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                            <p className="text-gray-500">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Catégories */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-10">Catégories populaires</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Array.isArray(categories) && categories.slice(0, 8).map((cat) => (
                            <Link
                                key={cat.id}
                                to={`/services?category=${cat.id}`}
                                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition text-center"
                            >
                                <div className="text-4xl mb-2">{cat.icon || '🏠'}</div>
                                <h3 className="font-semibold text-gray-800">{cat.name}</h3>
                                <p className="text-sm text-gray-400">{cat.services_count} services</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services récents */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-3xl font-bold">Services récents</h2>
                        <Link to="/services" className="text-blue-600 hover:underline">
                            Voir tout →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-6">
                            {Array.isArray(services) && services.map((service) => (
                                <ServiceCard key={service.id} service={service} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;