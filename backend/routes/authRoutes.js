const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const { registerUsers } = require('../controller/authController')

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
router.post('/register', registerUsers)

module.exports = router