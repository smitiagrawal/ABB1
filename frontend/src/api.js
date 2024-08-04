import axios from 'axios';
import { Alert } from 'react-bootstrap';
// Base URL for the backend API
const API_URL = 'http://localhost:5000/api';

// Function to fetch all auctions
export const fetchAuctions = async () => {
    try {
        const response = await axios.get(`${API_URL}/auctions`);
        return response.data;
    } catch (error) {
        console.error('Error fetching auctions:', error);
        throw error;
    }
};

// Function to add a new auction
export const addAuction = async (auctionData) => {
    try {
        const response = await axios.post(`${API_URL}/auctions`, auctionData, {
            headers: {
                'Content-Type': 'application/json',
                // Add any additional headers if needed (e.g., Authorization)
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error adding auction:', error);
        throw error;
    }
};

// export const addAuction = async (auctionData) => {
//     try {
//         const token = localStorage.getItem('token');
//         const response = await axios.post(`${API_URL}/auctions`, auctionData, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error adding auction:', error);
//         throw error;
//     }
// };

// Function to handle user login
// export const loginUser = async (credentials) => {
//     try {
//         const response = await axios.post(`${API_URL}/users/login`, credentials);
//         const { token } = response.data;
//         localStorage.setItem('token', token); // Store token in localStorage
//         return response.data;
//     } catch (error) {
//         console.error('Error logging in:', error);
//         throw error;
//     }
// };
export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/users/login`, credentials);
        const { token, ...userData } = response.data;

        // Store the token in localStorage
        localStorage.setItem('token', token);

        return userData; // Return user data excluding token
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Login failed. Invalid Credentials');
    }
};

export const logoutUser = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    window.location.href = '/'; // Redirect to home page
    alert('You have been logged out successfully!');
};

// Function to handle user registration
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/users/register`, userData);
        const { token } = response.data;
        localStorage.setItem('token', token); // Store token in localStorage
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

export const fetchUserProfile = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/users/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw new Error('Failed to fetch user profile');
    }
};
export const fetchUserAuctions = async () => {
    // Fetch auctions created by the user from your API
    const response = await fetch('/api/user/auctions');
    if (!response.ok) {
        throw new Error('Failed to fetch user auctions');
    }
    return response.json();
};