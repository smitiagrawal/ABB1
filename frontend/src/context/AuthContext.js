import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, logoutUser } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser({ token });
        }
    }, []);

    const login = async (credentials) => {
        try {
            const userData = await loginUser(credentials);
            setUser(userData);
            setError(''); // Clear any previous error
        } catch (error) {
            setError(error.message || 'Login failed. Invalid Credentials');
            throw error; // Rethrow error to handle it in LoginPage
        }
    };

    const logout = () => {
        setUser(null);
        logoutUser(); // Remove token from localStorage
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
