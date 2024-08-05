const express = require('express');
const router = express.Router();
const { getUserBids } = require('../controllers/bidController');
const { protect } = require('../middleware/authMiddleware');

// Route to get bids for the authenticated user
router.get('/user', protect, getUserBids);

module.exports = router;
