import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('wanderlust_user');
        return stored ? JSON.parse(stored) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem('wanderlust_token'));
    const [loading, setLoading] = useState(false);

    const saveAuth = (userData, tokenData) => {
        setUser(userData);
        setToken(tokenData);
        localStorage.setItem('wanderlust_user', JSON.stringify(userData));
        localStorage.setItem('wanderlust_token', tokenData);
    };

    const clearAuth = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('wanderlust_user');
        localStorage.removeItem('wanderlust_token');
    };

    const signup = async (name, email, password) => {
        setLoading(true);
        try {
            const { data } = await api.post('/auth/signup', { name, email, password });
            saveAuth(data.user, data.token);
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Signup failed.' };
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', { email, password });
            saveAuth(data.user, data.token);
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Login failed.' };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => clearAuth();

    return (
        <AuthContext.Provider value={{ user, token, loading, signup, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
