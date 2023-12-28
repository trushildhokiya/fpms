const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const { registerUsers, loginUsers, validateUser } = require('../controller/authController')

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register user 
 *     description: Register user based on specified roles
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully created user
 */
router.route('/register').post(registerUsers)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login User
 *     description: Authenticate a user and generate an access token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in. Returns an access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The generated access token.
 *       400:
 *         description: Bad Request. Invalid input or user not found.
 *       401:
 *         description: Unauthorized. Invalid credentials or account not activated.
 *       500:
 *         description: Internal Server Error.
 */


router.route('/login').post(loginUsers)

/**
 * @swagger
 * /auth/validate:
 *   get:
 *     summary: Validate User Token
 *     description: Endpoint for validating user authentication token.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: User authentication token.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Token is valid. User is authorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authorized:
 *                   type: boolean
 *                   description: Indicates whether the user is authorized.
 *       401:
 *         description: Unauthorized. Invalid or expired token.
 */

router.route('/validate').get(validateUser)

module.exports = router