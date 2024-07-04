const express = require('express')
const headAuthenticator = require('../middleware/headAuthenticator')
const { createNotification,
    getNotifications,
    getFacultiesList,
    toggleFacultyApproval,
    getPatentData,
    getCopyrightData,
    getJournalData,
    getConferenceData
} = require('../controller/headController')
const router = express.Router()


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

router.route('/notify').post(headAuthenticator, createNotification)

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
router.route('/notifications').get(headAuthenticator, getNotifications)

/**
 * @swagger
 * /head/faculties:
 *   get:
 *     summary: Get Faculty List
 *     description: Retrieve a list of faculties for the Head of Department.
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
 *         description: Successfully retrieved list of faculties.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                     description: Email of the faculty member.
 *                   profileImage:
 *                     type: string
 *                     description: URL of the faculty member's profile image.
 *                   department:
 *                     type: string
 *                     description: Department of the faculty member.
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Tags associated with the faculty member.
 *                   verified:
 *                     type: boolean
 *                     description: Indicates whether the faculty member is verified or not.
 *       401:
 *         description: Unauthorized. User not found.
 *       403:
 *         description: Forbidden. Not a Head Of Department.
 *       500:
 *         description: Internal Server Error.
 */

router.route('/faculties').get(headAuthenticator, getFacultiesList)

/**
 * @swagger
 * /head/faculties:
 *   put:
 *     summary: Toggle Faculty Approval
 *     description: Approve or deactivate a faculty member in FPMS.
 *     tags:
 *       - Head Of Department
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isCoordinator:
 *                 type: boolean
 *                 description: Indicates whether the faculty member is a Research and Development Coordinator.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the faculty member.
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: Bearer token for Head Of Department authentication.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Faculty approval status updated successfully. An email will be sent to the faculty member.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Indicates the success status.
 *       400:
 *         description: Bad Request. User not found.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       500:
 *         description: Internal Server Error.
 */

router.route('/faculties').put(headAuthenticator, toggleFacultyApproval)

router.route('/data/patent').get(headAuthenticator, getPatentData)

router.route('/data/copyright').get(headAuthenticator, getCopyrightData)

router.route('/data/journal').get(headAuthenticator, getJournalData)

router.route('/data/conference').get(headAuthenticator, getConferenceData)


module.exports = router