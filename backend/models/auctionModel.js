const mongoose = require('mongoose');

const auctionSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        title: {
            type: String,
            required: [true, 'Please add a title']
        },
        description: {
            type: String,
            required: [true, 'Please add a description']
        },
        startingBid: {
            type: Number,
            required: [true, 'Please add a starting bid']
        },
        currentBid: {
            type: Number,
            default: 0,
        },
        endDate: {
            type: Date,
            required: [true, 'Please add an end date']
        },
        image: {
            type: String,
            required: [true, 'Please add an image']
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Auction', auctionSchema);
