const express = require('express');
const router = express.Router();
const { getUserBids } = require('../controllers/bidController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @openapi
 * /bids/user:
 *   get:
 *     summary: Get all bids placed by the logged-in user
 *     tags:
 *       - Bids
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user bids
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bid'
 *       404:
 *         description: No bids found for the user
 *       500:
 *         description: Error fetching user bids
 */

router.get('/user', protect, getUserBids);

module.exports = router;
