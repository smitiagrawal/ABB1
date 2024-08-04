// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { loginUser, logoutUser} from '../api';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [error, setError] = useState('');


//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             // Optionally, you could verify the token here and set user details if needed
//             setUser({ token });
//         }
//     }, []);

//     const login = async (credentials) => {
//         try {
//             const userData = await loginUser(credentials);
//             setUser(userData);
//             setError('');
//         } catch (error) {
//             setError(error.message || 'Login failed');
//         }
//     };

//     const logout = () => {
//         setUser(null);
//         logoutUser(); // Remove token from localStorage
//     };

//     return (
//         <AuthContext.Provider value={{ user, login, logout, error }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, logoutUser } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Optionally, verify the token and set user details if needed
            setUser({ token });
        }
    }, []);

    const login = async (credentials) => {
        try {
            const userData = await loginUser(credentials);
            setUser(userData);
            setError(''); // Clear any previous error
        } catch (error) {
            setError(error.message || 'Login failed');
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
