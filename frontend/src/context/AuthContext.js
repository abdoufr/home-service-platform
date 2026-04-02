import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const response = await authAPI.post('/login/', { username, password });
        const { user: userData, tokens } = response.data;
        localStorage.setItem('tokens', JSON.stringify(tokens));
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };

    const register = async (data) => {
        const response = await authAPI.post('/register/', data);
        const { user: userData, tokens } = response.data;
        localStorage.setItem('tokens', JSON.stringify(tokens));
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };

    const logout = async () => {
        try {
            const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
            await authAPI.post('/logout/', { refresh: tokens.refresh });
        } catch (e) {
            // Ignorer les erreurs de logout
        }
        localStorage.removeItem('tokens');
        localStorage.removeItem('user');
        setUser(null);
    };

    const updateProfile = async (data) => {
        const response = await authAPI.patch('/profile/', data);
        const updatedUser = { ...user, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return updatedUser;
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isClient: user?.role === 'CLIENT',
        isProvider: user?.role === 'PROVIDER',
        isAdmin: user?.role === 'ADMIN',
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};