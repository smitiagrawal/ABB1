const asyncHandler = require('express-async-handler');
const Bid = require('../models/bidModel');

const getUserBids = asyncHandler(async (req, res) => {
    const bids = await Bid.find({ user: req.user._id }).populate('auction');
    res.json(bids);
});

module.exports = {
    getUserBids,
};
