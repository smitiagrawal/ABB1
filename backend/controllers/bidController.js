const asyncHandler = require('express-async-handler');
const Bid = require('../models/bidModel'); // Assuming you have a Bid model

// @desc    Get user bids
// @route   GET /api/bids/user
// @access  Private
const getUserBids = asyncHandler(async (req, res) => {
    const bids = await Bid.find({ user: req.user._id }).populate('auction'); // Populate auction details
    res.json(bids);
});

module.exports = {
    getUserBids,
};
