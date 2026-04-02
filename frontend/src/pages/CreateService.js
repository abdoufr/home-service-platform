import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CreateService = () => {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        title: '',
        description: '',
        category: '',
        price: '',
        price_unit: 'HOUR',
        city: '',
        address: '',
        image: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/categories/')
            .then(res => setCategories(res.data.results || res.data))
            .catch(() => toast.error("Erreur chargement catégories"));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/services/create/', form);
            toast.success('Service créé avec succès');
            navigate('/provider/dashboard');
        } catch (error) {
            toast.error("Erreur création service");
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Ajouter un service</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">
                <input
                    type="text"
                    placeholder="Titre"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full border p-3 rounded"
                    required
                />

                <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full border p-3 rounded"
                    required
                />

                <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border p-3 rounded"
                    required
                >
                    <option value="">Choisir une catégorie</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>

                <input
                    type="number"
                    placeholder="Prix"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full border p-3 rounded"
                    required
                />

                <select
                    value={form.price_unit}
                    onChange={(e) => setForm({ ...form, price_unit: e.target.value })}
                    className="w-full border p-3 rounded"
                >
                    <option value="HOUR">Par heure</option>
                    <option value="FIXED">Forfait</option>
                    <option value="SQMETER">Par m²</option>
                </select>

                <input
                    type="text"
                    placeholder="Ville"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full border p-3 rounded"
                    required
                />

                <textarea
                    placeholder="Adresse"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full border p-3 rounded"
                />

                <input
                    type="url"
                    placeholder="Image URL"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="w-full border p-3 rounded"
                />

                <button className="bg-blue-600 text-white px-6 py-3 rounded">
                    Publier le service
                </button>
            </form>
        </div>
    );
};

export default CreateService;