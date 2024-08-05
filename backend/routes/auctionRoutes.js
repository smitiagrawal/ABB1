const express = require('express');
const {
    getAuctions,
    createAuction,
    updateAuction,
    deleteAuction,
    getUserAuctions,
    placeBid,
    getBidHistory,
    getAuctionById,
} = require('../controllers/auctionController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(getAuctions)
    .post(protect, createAuction);
router.route('/:id')
    .get(getAuctionById)
    .put(protect, updateAuction)
    .delete(protect, deleteAuction);
router.route('/user').get(protect, getUserAuctions);
router.route('/bid').post(protect, placeBid);
router.route('/:auctionId/bids').get(getBidHistory);

module.exports = router;
