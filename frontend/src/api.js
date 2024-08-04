import axios from 'axios';

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

// Function to handle user login
export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/users/login`, credentials);
        const { token } = response.data;
        localStorage.setItem('token', token); // Store token in localStorage
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

export const logoutUser = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
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

// Function to fetch user profile (if needed)
export const fetchUserProfile = async () => {
    try {
        const response = await axios.get(`${API_URL}/users/profile`, {
            // Add headers if needed, such as Authorization
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};
