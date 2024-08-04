const express = require('express');
const {
    getAuctions,
    getAuctionById,
    createAuction,
    updateAuction,
    deleteAuction,
} = require('../controllers/auctionController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(getAuctions).post(protect, createAuction);
router.route('/:id').get(getAuctionById).put(protect, updateAuction).delete(protect, deleteAuction);

module.exports = router;
