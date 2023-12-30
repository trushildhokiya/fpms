const express = require('express')
const headAuthenticator = require('../middleware/headAuthenticator')
const { headProfileImageUpload } = require('../middleware/fileUpload')
const { profileImageUpdate, createNotification, getNotifications } = require('../controller/headController')
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

/**
 * @swagger
 * /head/notify:
 *   post:
 *     summary: Create Notification
 *     description: Create a notification for the Head of Department.
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the notification.
 *               description:
 *                 type: string
 *                 description: The description of the notification.
 *               imageUrl:
 *                 type: string
 *                 description: URL of the image associated with the notification.
 *               referenceUrl:
 *                 type: string
 *                 description: URL reference related to the notification.
 *               department:
 *                 type: string
 *                 description: Department for which the notification is created.
 *     responses:
 *       200:
 *         description: Successfully created notification.
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
 *       500:
 *         description: Internal Server Error.
 */

router.route('/notify').post(headAuthenticator,createNotification)

/**
 * @swagger
 * /head/notifications:
 *   get:
 *     summary: Get Notifications
 *     description: Retrieve notifications for the Head of Department.
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
 *     responses:
 *       200:
 *         description: Successfully retrieved notifications.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     description: The title of the notification.
 *                   description:
 *                     type: string
 *                     description: The description of the notification.
 *                   imageUrl:
 *                     type: string
 *                     description: URL of the image associated with the notification.
 *                   referenceUrl:
 *                     type: string
 *                     description: URL reference related to the notification.
 *                   department:
 *                     type: string
 *                     description: Department for which the notification is created.
 *       401:
 *         description: Unauthorized. User not found.
 *       403:
 *         description: Forbidden. Not a Head Of Department.
 *       500:
 *         description: Internal Server Error.
 */
router.route('/notifications').get(headAuthenticator,getNotifications)
module.exports = router