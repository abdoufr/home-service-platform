import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        name: '',
        slug: '',
        description: '',
        icon: '',
        is_active: true,
    });

    const fetchCategories = async () => {
        try {
            const res = await api.get('/admin/categories/');
            setCategories(res.data.results || res.data);
        } catch (error) {
            toast.error("Erreur chargement catégories");
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/categories/', form);
            toast.success('Catégorie ajoutée');
            setForm({ name: '', slug: '', description: '', icon: '', is_active: true });
            fetchCategories();
        } catch (error) {
            toast.error("Erreur ajout catégorie");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer cette catégorie ?')) return;
        try {
            await api.delete(`/admin/categories/${id}/`);
            toast.success('Catégorie supprimée');
            fetchCategories();
        } catch (error) {
            toast.error("Erreur suppression");
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Gestion des catégories</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-8 space-y-4">
                <input
                    type="text"
                    placeholder="Nom"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border p-3 rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Slug"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full border p-3 rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Icône"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    className="w-full border p-3 rounded"
                />
                <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full border p-3 rounded"
                />
                <button className="bg-blue-600 text-white px-6 py-3 rounded">
                    Ajouter catégorie
                </button>
            </form>

            <div className="grid md:grid-cols-2 gap-4">
                {categories.map(cat => (
                    <div key={cat.id} className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
                        <div>
                            <h3 className="font-bold">{cat.icon} {cat.name}</h3>
                            <p className="text-gray-500">{cat.slug}</p>
                        </div>
                        <button
                            onClick={() => handleDelete(cat.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded"
                        >
                            Supprimer
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminCategories;