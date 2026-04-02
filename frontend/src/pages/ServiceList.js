import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ServiceCard from '../components/ServiceCard';
import { FiSearch, FiFilter } from 'react-icons/fi';

const ServiceList = () => {
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        city: searchParams.get('city') || '',
        ordering: searchParams.get('ordering') || '-created_at',
    });

    useEffect(() => {
        api.get('/categories/').then(res => {
            setCategories(res.data.results || res.data);
        });
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (filters.search) params.append('search', filters.search);
                if (filters.category) params.append('category', filters.category);
                if (filters.city) params.append('city', filters.city);
                if (filters.ordering) params.append('ordering', filters.ordering);

                const res = await api.get(`/services/?${params.toString()}`);
                setServices(res.data.results || res.data);
            } catch (error) {
                console.error('Erreur:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, [filters]);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([k, v]) => {
            if (v) params.set(k, v);
        });
        setSearchParams(params);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Tous les services</h1>

            {/* Filtres */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <div className="grid md:grid-cols-4 gap-4">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Toutes catégories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Ville..."
                        value={filters.city}
                        onChange={(e) => handleFilterChange('city', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                        value={filters.ordering}
                        onChange={(e) => handleFilterChange('ordering', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="-created_at">Plus récents</option>
                        <option value="price">Prix croissant</option>
                        <option value="-price">Prix décroissant</option>
                        <option value="-rating">Meilleures notes</option>
                    </select>
                </div>
            </div>

            {/* Résultats */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : services.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-6">
                    {services.map(service => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-gray-500">
                    <FiFilter size={48} className="mx-auto mb-4" />
                    <p className="text-xl">Aucun service trouvé</p>
                    <p>Essayez de modifier vos critères de recherche.</p>
                </div>
            )}
        </div>
    );
};

export default ServiceList;