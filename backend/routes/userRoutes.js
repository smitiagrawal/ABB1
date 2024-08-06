const express = require('express');
const { registerUser, authUser, getUserProfile, updateUserProfile, } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @openapi
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       description: User registration details
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's name
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid registration details
 *       500:
 *         description: Error registering user
 */

/**
 * @openapi
 * /users/login:
 *   post:
 *     summary: Authenticate a user and obtain a JWT
 *     tags:
 *       - Users
 *     requestBody:
 *       description: User login details
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *       400:
 *         description: Invalid login details
 *       500:
 *         description: Error logging in user
 */

/**
 * @openapi
 * /users/profile:
 *   get:
 *     summary: Get user profile information
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: User's name
 *                 email:
 *                   type: string
 *                   description: User's email address
 *       401:
 *         description: User not authorized
 *       500:
 *         description: Error fetching user profile
 */

/**
 * @openapi
 * /users/profile:
 *   put:
 *     summary: Update user profile information
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Updated user profile details
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's name
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's new password
 *             required:
 *               - name
 *               - email
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       400:
 *         description: Invalid profile details
 *       401:
 *         description: User not authorized
 *       500:
 *         description: Error updating user profile
 */

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
