const asyncHandler = require('express-async-handler');
const Auction = require('../models/auctionModel');
const path = require('path');

// Get all auctions
const getAuctions = asyncHandler(async (req, res) => {
    try {
        const auctions = await Auction.find();
        res.json(auctions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching auctions', error });
    }
});

const getUserAuctions = asyncHandler(async (req, res) => {
    const userId = req.user._id; // Ensure this is a valid ObjectId
    console.log('User ID:', userId); // Log the user ID to verify it's correct

    const auctions = await Auction.find({ user: userId });

    if (auctions) {
        res.status(200).json(auctions);
    } else {
        res.status(404);
        throw new Error('No auctions found');
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

// Update an auction
const updateAuction = asyncHandler(async (req, res) => {
    const auction = await Auction.findById(req.params.id);

    if (auction) {
        // Check if the logged-in user is the owner of the auction
        if (auction.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized');
        }

        auction.title = req.body.title || auction.title;
        auction.description = req.body.description || auction.description;
        auction.startingBid = req.body.startingBid || auction.startingBid;
        auction.endDate = req.body.endDate || auction.endDate;
        auction.image = req.body.image || auction.image; // Update image if provided

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
        // Check if the logged-in user is the owner of the auction
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

module.exports = {
    getAuctions,
    createAuction,
    updateAuction,
    deleteAuction,
    getUserAuctions,
};
