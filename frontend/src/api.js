import axios from 'axios';
// Base URL for the backend API
const API_URL = 'http://localhost:5000/api/';

// Function to fetch all auctions
export const fetchAuctions = async () => {
    try {
        const response = await axios.get(`${API_URL}auctions`);
        return response.data;
    } catch (error) {
        console.error('Error fetching auctions:', error);
        throw error;
    }
};

// Function to add a new auction
export const addAuction = async (auctionData) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.post(`${API_URL}auctions`, auctionData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding auction:', error);
        throw error;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}users/login`, credentials);
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
        const response = await axios.post(`${API_URL}users/register`, userData);
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
        const response = await axios.get(`${API_URL}users/profile`, {
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

// Update the user profile
export const updateUserProfile = async (profileData) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.put(`${API_URL}users/profile`, profileData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error.response ? error.response.data.message : error.message);
        throw error;
    }
};



export const getUserAuctions = async () => {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Log the token to ensure it's being retrieved correctly
    try {
        const response = await axios.get(`${API_URL}auctions/user`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user auctions:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const updateAuction = async (auctionId, auctionData) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.put(`${API_URL}auctions/${auctionId}`, auctionData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating auction:', error.response ? error.response.data.message : error.message);
        throw error;
    }
};

// Delete an auction
export const deleteAuction = async (auctionId) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.delete(`${API_URL}auctions/${auctionId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting auction:', error.response ? error.response.data.message : error.message);
        throw error;
    }
};


export const getBiddingHistory = async (id) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${API_URL}auctions/${id}/bids`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching bidding history:', error);
        throw error;
    }
};

export const placeBid = async (auctionId, bidAmount) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.post(
            `${API_URL}auctions/bid`,
            { auctionId, amount: bidAmount },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error placing bid:', error);
        throw error;
    }
};

export const getAuctionDetails = async (id) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${API_URL}auctions/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching auction details:', error);
        throw error;
    }
};

export const fetchUserBids = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${API_URL}bids/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user bids:', error);
      throw error;
    }
  };
  