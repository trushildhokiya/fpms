const express = require('express')
const { adminProfileImageUpload } = require('../middleware/fileUpload')
const { profileImageUpdate, registerUsers } = require('../controller/adminController')
const adminAuthenticator = require('../middleware/adminAuthenticator')
const router = express.Router()

/**
 * @swagger
 * /admin/profile/image:
 *   put:
 *     summary: Update Admin Profile Image
 *     description: Update the profile image for the authenticated admin.
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: email
 *         required: true
 *         description: Email of the authenticated admin.
 *         schema:
 *           type: string
 *       - in: header
 *         name: token
 *         required: true
 *         description: Authentication token of the admin.
 *         schema:
 *           type: string
 *       - in: formData
 *         name: profileImage
 *         required: true
 *         description: New profile image file to upload.
 *         type: file
 *     responses:
 *       200:
 *         description: Profile image successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Indicates the success status.
 *       400:
 *         description: Admin not found or invalid input.
 *       401:
 *         description: Unauthorized. Invalid or expired token.
 *       500:
 *         description: Internal Server Error.
 */
router.route('/profile/image').put(adminAuthenticator,adminProfileImageUpload.single('profileImage'),profileImageUpdate)

router.route('/create-user').post(adminAuthenticator,registerUsers)

module.exports= router