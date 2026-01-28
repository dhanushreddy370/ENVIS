import React, { createContext, useContext, useState, useEffect } from 'react';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('envis_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            // Optional: Validate token with backend here
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const { data } = await axiosInstance.post('/auth/login', { username, password });
            setUser(data);
            localStorage.setItem('envis_user', JSON.stringify(data));
            toast.success(`Welcome back, ${data.username}`);
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
            return false;
        }
    };

    const register = async (userData) => {
        try {
            const { data } = await axiosInstance.post('/auth/register', userData);
            setUser(data);
            localStorage.setItem('envis_user', JSON.stringify(data));
            toast.success("Identity Verified. Configuration Saved.");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
            return false;
        }
    };

    const updateProfile = async (settings) => {
        try {
            // Add token to header
            const token = user?.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const { data } = await axiosInstance.put('/auth/profile', { settings }, config);
            setUser(prev => ({ ...prev, settings: data.settings }));
            localStorage.setItem('envis_user', JSON.stringify({ ...user, settings: data.settings }));
            toast.success("Mainframe updated.");
            return true;
        } catch (error) {
            toast.error("Failed to save configuration.");
            return false;
        }
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem('envis_user');
        toast.success("Logged out.");
    };

    return (
        <AuthContext.Provider value={{ user, login, register, updateProfile, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
