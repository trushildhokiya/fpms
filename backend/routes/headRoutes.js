const express = require('express')
const headAuthenticator = require('../middleware/headAuthenticator')
const { headProfileImageUpload } = require('../middleware/fileUpload')
const { profileImageUpdate } = require('../controller/headController')
const router = express.Router()

/**
 * @swagger
 * /head/profile/image:
 *   put:
 *     summary: Update Head Profile Image
 *     description: Update the profile image for the Head of Department.
 *     tags:
 *       - Head Of Department
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: Bearer token for Head of Department authentication.
 *         schema:
 *           type: string
 *       - in: header
 *         name: email
 *         required: true
 *         description: Email of the Head of Department.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Successfully updated head profile image.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Indicates the success status.
 *       403:
 *         description: Forbidden. Not a Head Of Department.
 *       404:
 *         description: Not Found. Head Of Department not found.
 *       500:
 *         description: Internal Server Error.
 */

router.route('/profile/image').put(headAuthenticator,headProfileImageUpload.single('profileImage'),profileImageUpdate)


module.exports = router