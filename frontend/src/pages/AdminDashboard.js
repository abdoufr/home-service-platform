import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { authAPI } from '../api/axios';
import { FiPackage, FiUsers, FiGrid, FiCalendar, FiClock } from 'react-icons/fi';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [userStats, setUserStats] = useState(0);

    useEffect(() => {
        // Fetch stats from api-service
        api.get('/dashboard/stats/').then(res => setStats(res.data)).catch(err => console.error("Erreur stats API:", err));
        
        // Fetch total users from auth-service
        authAPI.get('/users/').then(res => {
            const count = res.data.count ?? res.data.length ?? 0;
            setUserStats(count);
        }).catch(err => console.error("Erreur stats Users:", err));
    }, []);

    if (!stats) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Tableau de bord - Administration</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <Link to="/admin/users" className="bg-red-500 hover:bg-red-600 transition-colors text-white rounded-xl p-6 shadow-md text-center block">
                    <div className="mb-3 flex justify-center"><FiUsers size={32} /></div>
                    <p className="text-3xl font-bold">{userStats}</p>
                    <p className="text-sm opacity-90 mt-1 font-medium">Utilisateurs</p>
                </Link>

                <Link to="/admin/bookings" className="bg-purple-500 hover:bg-purple-600 transition-colors text-white rounded-xl p-6 shadow-md text-center block">
                    <div className="mb-3 flex justify-center"><FiCalendar size={32} /></div>
                    <p className="text-3xl font-bold">{stats.total_bookings}</p>
                    <p className="text-sm opacity-90 mt-1 font-medium">Réservations</p>
                </Link>

                <Link to="/admin/services" className="bg-blue-500 hover:bg-blue-600 transition-colors text-white rounded-xl p-6 shadow-md text-center block">
                    <div className="mb-3 flex justify-center"><FiPackage size={32} /></div>
                    <p className="text-3xl font-bold">{stats.total_services}</p>
                    <p className="text-sm opacity-90 mt-1 font-medium">Services</p>
                </Link>

                <Link to="/admin/categories" className="bg-green-500 hover:bg-green-600 transition-colors text-white rounded-xl p-6 shadow-md text-center block">
                    <div className="mb-3 flex justify-center"><FiGrid size={32} /></div>
                    <p className="text-3xl font-bold">{stats.total_categories}</p>
                    <p className="text-sm opacity-90 mt-1 font-medium">Catégories</p>
                </Link>

                <div className="bg-yellow-500 text-white rounded-xl p-6 shadow-md text-center">
                    <div className="mb-3 flex justify-center"><FiClock size={32} /></div>
                    <p className="text-3xl font-bold">{stats.pending_bookings}</p>
                    <p className="text-sm opacity-90 mt-1 font-medium">En attente</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;