const mongoose = require('mongoose');

const auctionSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        startingBid: {
            type: Number,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Auction = mongoose.model('Auction', auctionSchema);

module.exports = Auction;
