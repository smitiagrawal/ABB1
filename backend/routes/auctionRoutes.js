const express = require('express');
const {
    getAuctions,
    getAuctionById,
    createAuction,
    updateAuction,
    deleteAuction,
    getUserAuctions,
} = require('../controllers/auctionController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(getAuctions).post( createAuction);
router.route('/:id').get(getAuctionById).put(updateAuction).delete(deleteAuction);
router.route('/user').get(protect, getUserAuctions); // Route to fetch user's auctions

module.exports = router;
