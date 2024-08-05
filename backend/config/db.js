// In db.js or another appropriate file

const mongoose = require('mongoose');
const Auction = require('../models/auctionModel'); // Adjust the path as necessary
const Bid = require('../models/bidModel'); // Adjust the path as necessary

// Fetch auctions for a specific user
const getAuctionsForUser = async (userId) => {
    try {
        return await Auction.find({ user: userId }); // Adjust the query as necessary
    } catch (error) {
        throw new Error('Error fetching auctions');
    }
};

const getBidsForUser = async (userId) => {
    try {
        return await Bid.find({ user: userId }).populate('auction'); // Populate auction details
    } catch (error) {
        throw new Error('Error fetching bids');
    }
};

module.exports = { getAuctionsForUser, getBidsForUser };
