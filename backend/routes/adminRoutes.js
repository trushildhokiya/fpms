const express = require('express')
const { adminProfileImageUpload } = require('../middleware/fileUpload')
const { profileImageUpdate, registerUsers, facultyList, headList, adminList, getPatentData, getCopyrightData, getJournalData, getConferenceData, getBookData, getBookChapterData, getNeedBasedProjectsData, getAwardsHonorsData, getProjectsData, getConsultancyData, getDashboardData, toggleRole } = require('../controller/adminController')
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


/**
 * @swagger
 * /admin/create-user:
 *   post:
 *     summary: Create User
 *     description: Register a new user with specified roles (Admin or Head of Department).
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: Bearer token for admin authentication.
 *         schema:
 *           type: string
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
 *               department:
 *                 type: string
 *     responses:
 *       200:
 *         description: User successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Indicates the success status.
 *       400:
 *         description: User already exists or invalid input.
 *       403:
 *         description: Forbidden. Only admins are allowed to create users.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       500:
 *         description: Internal Server Error.
 */

router.route('/create-user').post(adminAuthenticator,registerUsers)

/**
 * @swagger
 * /admin/data/faculty:
 *   get:
 *     summary: Get Faculty List
 *     description: Retrieve a list of faculty members.
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: Bearer token for admin authentication.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved faculty list.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   // Specify properties of a faculty member here
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       500:
 *         description: Internal Server Error.
 */

router.route('/data/faculty').get(adminAuthenticator,facultyList)

/**
 * @swagger
 * /admin/data/head:
 *   get:
 *     summary: Get Head List
 *     description: Retrieve a list of head of department members.
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: Bearer token for admin authentication.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved head of department list.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   // Specify properties of a head of department here
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       500:
 *         description: Internal Server Error.
 */

router.route('/data/head').get(adminAuthenticator,headList)

/**
 * @swagger
 * /admin/data/admin:
 *   get:
 *     summary: Get Admin List
 *     description: Retrieve a list of admin members.
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: Bearer token for admin authentication.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved admin list.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   // Specify properties of an admin member here
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       500:
 *         description: Internal Server Error.
 */

router.route('/data/admin').get(adminAuthenticator,adminList)


router.route('/data/patent').get(adminAuthenticator, getPatentData)

router.route('/data/copyright').get(adminAuthenticator, getCopyrightData)

router.route('/data/journal').get(adminAuthenticator, getJournalData)

router.route('/data/conference').get(adminAuthenticator, getConferenceData)

router.route('/data/book').get(adminAuthenticator, getBookData)

router.route('/data/book-chapter').get(adminAuthenticator, getBookChapterData)

router.route('/data/need-based-project').get(adminAuthenticator, getNeedBasedProjectsData)

router.route('/data/award-honors').get(adminAuthenticator, getAwardsHonorsData)

router.route('/data/projects').get(adminAuthenticator, getProjectsData)

router.route('/data/consultancy').get(adminAuthenticator, getConsultancyData)

router.route('/dashboard').get(adminAuthenticator,getDashboardData)

router.route('/toggle-role').put(adminAuthenticator, toggleRole)

module.exports= router