const asyncHandler = require('express-async-handler');
const Auction = require('../models/auctionModel');

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
    const auctions = await Auction.find({ user: req.user._id });
    res.json(auctions);
});

// Get auction by ID
const getAuctionById = asyncHandler(async (req, res) => {
    const auction = await Auction.findById(req.params.id);
    if (auction) {
        res.json(auction);
    } else {
        res.status(404).json({ message: 'Auction not found' });
    }
});

// Create a new auction
const createAuction = asyncHandler(async (req, res) => {
    const { title, description, startingBid, endDate } = req.body;
    const auction = new Auction({ title, description, startingBid, endDate });
    const createdAuction = await auction.save();
    res.status(201).json(createdAuction);
});

// const createAuction = asyncHandler(async (req, res) => {
//     const { title, description, startingBid, endDate } = req.body;

//     if (!title || !description || !startingBid || !endDate) {
//         res.status(400);
//         throw new Error('Please add all fields');
//     }

//     try {
//         const auction = new Auction({
//             title,
//             description,
//             startingBid,
//             endDate,
//             user: req.user._id, // Assign the logged-in user as the owner
//         });

//         const createdAuction = await auction.save();
//         res.status(201).json(createdAuction);
//     } catch (error) {
//         console.error(error);
//         res.status(500);
//         throw new Error('Server Error: Unable to create auction');
//     }
// });
// Update an auction
const updateAuction = asyncHandler(async (req, res) => {
    const { title, description, startingBid, endDate } = req.body;
    const auction = await Auction.findById(req.params.id);

    if (auction) {
        auction.title = title || auction.title;
        auction.description = description || auction.description;
        auction.startingBid = startingBid || auction.startingBid;
        auction.endDate = endDate || auction.endDate;

        const updatedAuction = await auction.save();
        res.json(updatedAuction);
    } else {
        res.status(404).json({ message: 'Auction not found' });
    }
});

// Delete an auction
const deleteAuction = asyncHandler(async (req, res) => {
    const auction = await Auction.findById(req.params.id);
    if (auction) {
        await auction.remove();
        res.json({ message: 'Auction removed' });
    } else {
        res.status(404).json({ message: 'Auction not found' });
    }
});

module.exports = {
    getAuctions,
    getAuctionById,
    createAuction,
    updateAuction,
    deleteAuction,
    getUserAuctions,
};
