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
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.route('/')
    .get(getAuctions)
    .post(protect, upload.single('file'), createAuction);
router.route('/:id')
    .get(getAuctionById) // Add this line
    .put(protect, upload.single('file'), updateAuction)
    .delete(protect, deleteAuction);
router.route('/user').get(protect, getUserAuctions);
router.route('/bid').post(protect, placeBid);
router.route('/:auctionId/bids').get(getBidHistory);

module.exports = router;
