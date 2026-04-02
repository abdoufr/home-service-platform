import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
    const { user, isAuthenticated, logout, isProvider, isAdmin, isClient } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <FiHome className="text-blue-600 text-2xl" />
                        <span className="text-xl font-bold text-gray-800">
                            Home<span className="text-blue-600">Service</span>
                        </span>
                    </Link>

                    {/* Desktop menu */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <Link to="/" className="text-gray-600 hover:text-blue-600">
                            Accueil
                        </Link>

                        <Link to="/services" className="text-gray-600 hover:text-blue-600">
                            Services
                        </Link>

                        {isAuthenticated ? (
                            <>
                                {isProvider && (
                                    <>
                                        <Link
                                            to="/provider/dashboard"
                                            className="text-gray-600 hover:text-blue-600"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            to="/services/new"
                                            className="text-gray-600 hover:text-blue-600"
                                        >
                                            Ajouter service
                                        </Link>
                                    </>
                                )}

                                {isAdmin && (
                                    <>
                                        <Link
                                            to="/admin/dashboard"
                                            className="text-gray-600 hover:text-blue-600"
                                        >
                                            Admin
                                        </Link>
                                        <Link
                                            to="/admin/categories"
                                            className="text-gray-600 hover:text-blue-600"
                                        >
                                            Catégories
                                        </Link>
                                        <Link
                                            to="/admin/users"
                                            className="text-gray-600 hover:text-blue-600"
                                        >
                                            Utilisateurs
                                        </Link>
                                        <Link
                                            to="/admin/bookings"
                                            className="text-gray-600 hover:text-blue-600"
                                        >
                                            Réservations
                                        </Link>
                                    </>
                                )}

                                {isClient && (
                                    <Link
                                        to="/bookings"
                                        className="text-gray-600 hover:text-blue-600"
                                    >
                                        Mes réservations
                                    </Link>
                                )}

                                <div className="flex items-center space-x-3">
                                    <Link
                                        to="/profile"
                                        className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
                                    >
                                        <FiUser />
                                        <span>{user?.username}</span>
                                    </Link>

                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                        {user?.role}
                                    </span>

                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-600 hover:text-red-600"
                                        title="Déconnexion"
                                    >
                                        <FiLogOut />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex space-x-3">
                                <Link
                                    to="/login"
                                    className="text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50"
                                >
                                    Connexion
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Inscription
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile toggle button */}
                    <button
                        className="lg:hidden"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="lg:hidden pb-4 space-y-2">
                        <Link
                            to="/"
                            className="block py-2 text-gray-600"
                            onClick={() => setMenuOpen(false)}
                        >
                            Accueil
                        </Link>

                        <Link
                            to="/services"
                            className="block py-2 text-gray-600"
                            onClick={() => setMenuOpen(false)}
                        >
                            Services
                        </Link>

                        {isAuthenticated ? (
                            <>
                                {isProvider && (
                                    <>
                                        <Link
                                            to="/provider/dashboard"
                                            className="block py-2 text-gray-600"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            to="/services/new"
                                            className="block py-2 text-gray-600"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            Ajouter service
                                        </Link>
                                    </>
                                )}

                                {isAdmin && (
                                    <>
                                        <Link
                                            to="/admin/dashboard"
                                            className="block py-2 text-gray-600"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            Admin
                                        </Link>
                                        <Link
                                            to="/admin/categories"
                                            className="block py-2 text-gray-600"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            Catégories
                                        </Link>
                                        <Link
                                            to="/admin/users"
                                            className="block py-2 text-blue-600 font-bold"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            Utilisateurs
                                        </Link>
                                        <Link
                                            to="/admin/bookings"
                                            className="block py-2 text-gray-600"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            Réservations
                                        </Link>
                                    </>
                                )}

                                {isClient && (
                                    <Link
                                        to="/bookings"
                                        className="block py-2 text-gray-600"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Mes réservations
                                    </Link>
                                )}

                                <div className="py-2 text-sm text-gray-500">
                                    Connecté : <strong>{user?.username}</strong> ({user?.role})
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="block py-2 text-red-600"
                                >
                                    Déconnexion
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block py-2 text-blue-600"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Connexion
                                </Link>
                                <Link
                                    to="/register"
                                    className="block py-2 text-blue-600"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Inscription
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;