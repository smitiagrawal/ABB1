
const express = require('express');
const {
    getAuctions,
    createAuction,
    getAuctionsForUser,
    updateAuction,
    deleteAuction,
    placeBid,
    getBidHistory,
    getAuctionById,
} = require('../controllers/auctionController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
/**
 * @openapi
 * /auctions:
 *   get:
 *     summary: Get all ongoing auctions
 *     tags:
 *       - Auctions
 *     responses:
 *       200:
 *         description: A list of ongoing auctions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Auction'
 *       500:
 *         description: Error fetching auctions
 *   post:
 *     summary: Create a new auction
 *     tags:
 *       - Auctions
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Auction object to create
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the auction
 *               description:
 *                 type: string
 *                 description: Description of the auction
 *               startingBid:
 *                 type: number
 *                 format: float
 *                 description: Starting bid amount
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: End date of the auction
 *               image:
 *                 type: string
 *                 description: URL of the auction image
 *             required:
 *               - title
 *               - description
 *               - startingBid
 *               - endDate
 *               - image
 *     responses:
 *       201:
 *         description: Auction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auction'
 *       400:
 *         description: Error creating auction
 */

/**
 * @openapi
 * /auctions/{id}:
 *   get:
 *     summary: Get auction by ID
 *     tags:
 *       - Auctions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the auction
 *     responses:
 *       200:
 *         description: Auction details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auction'
 *       404:
 *         description: Auction not found
 *       500:
 *         description: Error fetching auction
 *   put:
 *     summary: Update an auction
 *     tags:
 *       - Auctions
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the auction to update
 *     requestBody:
 *       description: Updated auction object
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the auction
 *               description:
 *                 type: string
 *                 description: Description of the auction
 *               startingBid:
 *                 type: number
 *                 format: float
 *                 description: Starting bid amount
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: End date of the auction
 *               image:
 *                 type: string
 *                 description: URL of the auction image
 *             required:
 *               - title
 *               - description
 *               - startingBid
 *               - endDate
 *               - image
 *     responses:
 *       200:
 *         description: Auction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auction'
 *       401:
 *         description: User not authorized
 *       404:
 *         description: Auction not found
 *       500:
 *         description: Error updating auction
 *   delete:
 *     summary: Delete an auction
 *     tags:
 *       - Auctions
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the auction to delete
 *     responses:
 *       200:
 *         description: Auction deleted successfully
 *       401:
 *         description: User not authorized
 *       404:
 *         description: Auction not found
 *       500:
 *         description: Error deleting auction
 */

/**
 * @openapi
 * /auctions/user:
 *   get:
 *     summary: Get auctions created by the logged-in user
 *     tags:
 *       - Auctions
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user auctions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Auction'
 *       404:
 *         description: No auctions found
 *       500:
 *         description: Error fetching user auctions
 */

/**
 * @openapi
 * /auctions/bid:
 *   post:
 *     summary: Place a bid on an auction
 *     tags:
 *       - Bids
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Bid object to place
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               auctionId:
 *                 type: string
 *                 description: ID of the auction to place a bid on
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: Amount of the bid
 *             required:
 *               - auctionId
 *               - amount
 *     responses:
 *       201:
 *         description: Bid placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bid:
 *                   $ref: '#/components/schemas/Bid'
 *                 currentBid:
 *                   type: number
 *                   format: float
 *       400:
 *         description: Invalid bid amount
 *       404:
 *         description: Auction not found
 *       500:
 *         description: Error placing bid
 */

/**
 * @openapi
 * /auctions/{auctionId}/bids:
 *   get:
 *     summary: Get bid history for an auction
 *     tags:
 *       - Bids
 *     parameters:
 *       - in: path
 *         name: auctionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the auction
 *     responses:
 *       200:
 *         description: List of bids for the auction
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bid'
 *       500:
 *         description: Error fetching bid history
 */
router.route('/')
    .get(getAuctions)
    .post(protect, createAuction);
router.route('/user').get(protect, getAuctionsForUser); // Add this
router.route('/:id')
    .get(getAuctionById)
    .put(protect, updateAuction)
    .delete(protect, deleteAuction);
router.route('/bid').post(protect, placeBid);
router.route('/:auctionId/bids').get(getBidHistory);

module.exports = router;
