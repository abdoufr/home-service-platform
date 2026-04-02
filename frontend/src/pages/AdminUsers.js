import React, { useEffect, useState } from 'react';
import { authAPI } from '../api/axios';
import toast from 'react-hot-toast';
import { FiSearch } from 'react-icons/fi';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterRole, setFilterRole] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterRole) params.append('role', filterRole);
            if (searchQuery) params.append('search', searchQuery);
            
            const res = await authAPI.get(`/users/?${params.toString()}`);
            setUsers(res.data.results || res.data);
        } catch (error) {
            toast.error("Erreur chargement utilisateurs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [filterRole, searchQuery]);

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer cet utilisateur ?')) return;
        try {
            await authAPI.delete(`/users/${id}/`);
            toast.success('Utilisateur supprimé');
            fetchUsers();
        } catch (error) {
            toast.error("Erreur suppression utilisateur");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>

                <div className="flex space-x-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <FiSearch className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher (nom, email...)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="border rounded-lg px-4 py-2"
                    >
                        <option value="">Tous les rôles</option>
                        <option value="CLIENT">Clients</option>
                        <option value="PROVIDER">Prestataires</option>
                        <option value="ADMIN">Admins</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10">Chargement...</div>
            ) : (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="p-4">ID</th>
                                <th className="p-4">Username</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Nom</th>
                                <th className="p-4">Rôle</th>
                                <th className="p-4">Ville</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-t">
                                    <td className="p-4">{user.id}</td>
                                    <td className="p-4">{user.username}</td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4">{user.first_name} {user.last_name}</td>
                                    <td className="p-4">
                                        <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">{user.city || '-'}</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="bg-red-600 text-white px-3 py-1 rounded"
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {users.length === 0 && (
                        <div className="p-6 text-center text-gray-500">
                            Aucun utilisateur trouvé
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminUsers;