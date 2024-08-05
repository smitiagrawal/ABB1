const mongoose = require('mongoose');
const Auction = require('../models/auctionModel');
const Bid = require('../models/bidModel');

const getAuctionsForUser = async (userId) => {
    try {
        return await Auction.find({ user: userId });
    } catch (error) {
        throw new Error('Error fetching auctions');
    }
};

const getBidsForUser = async (userId) => {
    try {
        return await Bid.find({ user: userId }).populate('auction');
    } catch (error) {
        throw new Error('Error fetching bids');
    }
};

module.exports = { getAuctionsForUser, getBidsForUser };
