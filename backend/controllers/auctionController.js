const asyncHandler = require('express-async-handler');
const Auction = require('../models/auctionModel');
const Bid = require('../models/bidModel');
const { sendOutbidNotification } = require('../services/emailService');

const getAuctions = asyncHandler(async (req, res) => {
    try {
        const currentDate = new Date();
        const auctions = await Auction.find({ endDate: { $gte: currentDate } });
        res.json(auctions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching auctions', error });
    }
});


const getUserAuctions = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    try {
        if (!userId) {
            return res.status(400).json({ message: 'User ID is missing' });
        }
        const auctions = await Auction.find({ user: userId }).lean();
        if (auctions.length > 0) {
            res.status(200).json(auctions);
        } else {
            res.status(404).json({ message: 'No auctions found' });
        }
    } catch (error) {
        console.error('Error fetching user auctions:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


const createAuction = asyncHandler(async (req, res) => {
    try {
        const { title, description, startingBid, endDate, image } = req.body;
        const auction = new Auction({
            title,
            description,
            startingBid,
            endDate,
            image,
            user: req.user._id
        });
        const createdAuction = await auction.save();
        res.status(201).json(createdAuction);
    } catch (error) {
        res.status(400).json({ message: 'Error creating auction', error });
    }
});

const updateAuction = asyncHandler(async (req, res) => {
    const auction = await Auction.findById(req.params.id);
    if (auction) {
        if (auction.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized');
        }
        auction.title = req.body.title || auction.title;
        auction.description = req.body.description || auction.description;
        auction.startingBid = req.body.startingBid || auction.startingBid;
        auction.endDate = req.body.endDate || auction.endDate;
        auction.image = req.body.image || auction.image;
        const updatedAuction = await auction.save();
        res.status(200).json(updatedAuction);
    } else {
        res.status(404);
        throw new Error('Auction not found');
    }
});

const deleteAuction = asyncHandler(async (req, res) => {
    const auction = await Auction.findById(req.params.id);
    if (auction) {
        if (auction.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized');
        }
        await Auction.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Auction removed' });
    } else {
        res.status(404);
        throw new Error('Auction not found');
    }
});

const placeBid = asyncHandler(async (req, res) => {
    try {
        const { auctionId, amount } = req.body;
        const auction = await Auction.findById(auctionId);
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }
        if (amount <= auction.currentBid) {
            return res.status(400).json({ message: 'Bid amount must be higher than current bid' });
        }
        const bid = new Bid({
            amount,
            user: req.user._id,
            auction: auctionId,
        });
        await bid.save();
        auction.currentBid = amount;
        await auction.save();
        const previousBids = await Bid.find({ auction: auctionId }).populate('user');
        const currentBidderEmail = req.user.email;
        const previousBidders = previousBids
            .map(bid => bid.user.email)
            .filter(email => email !== currentBidderEmail);
        await sendOutbidNotification(previousBidders, auction.title);
        res.status(201).json({
            bid,
            currentBid: auction.currentBid
        });
    } catch (error) {
        console.error('Error placing bid:', error);
        res.status(500).json({ message: 'Error placing bid', error });
    }
});

const getBidHistory = asyncHandler(async (req, res) => {
    try {
        const { auctionId } = req.params;
        const bids = await Bid.find({ auction: auctionId }).populate('user', 'name').sort({ date: -1 });
        res.status(200).json(bids);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bid history', error });
    }
});

const getAuctionById = asyncHandler(async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.id);
        if (auction) {
            res.status(200).json(auction);
        } else {
            res.status(404).json({ message: 'Auction not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching auction', error });
    }
});

module.exports = {
    getAuctions,
    createAuction,
    updateAuction,
    deleteAuction,
    getUserAuctions,
    placeBid,
    getBidHistory,
    getAuctionById,
};