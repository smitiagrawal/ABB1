import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, logoutUser} from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Optionally, you could verify the token here and set user details if needed
            setUser({ token });
        }
    }, []);

    const login = async (credentials) => {
        try {
            const userData = await loginUser(credentials);
            setUser(userData);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const logout = () => {
        setUser(null);
        logoutUser(); // Remove token from localStorage
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
