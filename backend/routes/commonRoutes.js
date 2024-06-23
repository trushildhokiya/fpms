const express = require("express");
const facultyAuthenticator = require("../middleware/facultyAuthenticator");

//add the addTable modules here
const {
  addProfile,
  getProfileData,
  addExperience,
  getExperienceData,
  addResearchProfile,
  getResearchProfileData,
  addPatents,
  addBook,
  addJournal,
  addConference,
  addCopyright,
  addBookChapter,
  getPatentData,
  getCopyrightData,
} = require("../controller/commonController");

//add the file upload modules here
const {
  experienceFileUpload,
  patentFileUpload,
  bookFileUpload,
  journalFileUpload,
  conferenceFileUpload,
  copyrightFileUpload,
  bookChapterUpload,
} = require("../middleware/fileUpload");
const router = express.Router();

/**
 * @swagger
 * common/profile:
 *   post:
 *     summary: Add or update faculty profile
 *     description: This endpoint allows authenticated faculty members to add or update their profile information.
 *     tags:
 *       - Faculty
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: Bearer token for faculty authentication.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               department:
 *                 type: string
 *                 example: Computer Science
 *               designation:
 *                 type: string
 *                 example: Professor
 *               contact:
 *                 type: integer
 *                 example: 1234567890
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               alternateContact:
 *                 type: integer
 *                 example: 9876543210
 *               alternateEmail:
 *                 type: string
 *                 example: john.alternate@example.com
 *     responses:
 *       200:
 *         description: Profile added/updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *       400:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found!
 *       401:
 *         description: Invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid token
 *       403:
 *         description: Forbidden. Not a faculty member.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Forbidden. Not a faculty
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
router.route("/profile").post(facultyAuthenticator, addProfile);

/**
 * @swagger
 * /common/profile:
 *   get:
 *     summary: Get faculty profile data
 *     description: Retrieve the profile data of a faculty member based on the provided JWT token.
 *     tags:
 *       - Faculty
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: Bearer token for faculty authentication.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 department:
 *                   type: string
 *                   example: Computer Science
 *                 designation:
 *                   type: string
 *                   example: Professor
 *                 contact:
 *                   type: number
 *                   example: 1234567890
 *                 email:
 *                   type: string
 *                   example: john.doe@example.com
 *                 alternateContact:
 *                   type: number
 *                   example: 9876543210
 *                 alternateEmail:
 *                   type: string
 *                   example: john.alternate@example.com
 *       400:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found!
 *       401:
 *         description: Invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid token
 *       403:
 *         description: Forbidden. Not a faculty member.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Forbidden. Not a faculty
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
router.route("/profile").get(facultyAuthenticator, getProfileData);

/**
 * @swagger
 * /common/experience:
 *   post:
 *     summary: Add faculty experience
 *     description: This endpoint allows authenticated faculty members to add their experience details along with proof of experience.
 *     tags:
 *       - Faculty
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: Bearer token for faculty authentication.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               experienceDetails:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     experienceType:
 *                       type: string
 *                       example: Teaching
 *                     organizationName:
 *                       type: string
 *                       example: ABC University
 *                     organizationAddress:
 *                       type: string
 *                       example: 123 University Ave, City, Country
 *                     organizationUrl:
 *                       type: string
 *                       example: http://www.abcuniversity.edu
 *                     designation:
 *                       type: string
 *                       example: Professor
 *                     fromDate:
 *                       type: string
 *                       format: date
 *                       example: 2010-01-01
 *                     toDate:
 *                       type: string
 *                       format: date
 *                       example: 2020-01-01
 *                     experienceIndustry:
 *                       type: string
 *                       example: Education
 *                     experienceProof:
 *                       type: string
 *                       format: binary
 *                       description: Proof of experience file
 *                       example: proof.pdf
 *     responses:
 *       200:
 *         description: Experience added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *       400:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found!
 *       401:
 *         description: Invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid token
 *       403:
 *         description: Forbidden. Not a faculty member.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Forbidden. Not a faculty member
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
router.route("/experience").post(facultyAuthenticator, experienceFileUpload.any("experienceProof"), addExperience);

/**
 * @swagger
 * /common/experience:
 *   get:
 *     summary: Retrieve faculty experience data
 *     description: |
 *       Retrieves the experience details of a faculty member based on the provided JWT token.
 *       Calculates industry, teaching, and total experience durations.
 *     tags:
 *       - Faculty
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: Bearer token for faculty authentication.
 *         type: string
 *     responses:
 *       200:
 *         description: Experience data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 experience:
 *                   type: array
 *                   description: List of experience items.
 *                   items:
 *                     type: object
 *                     properties:
 *                       experienceType:
 *                         type: string
 *                         example: Teaching
 *                       organizationName:
 *                         type: string
 *                         example: ABC University
 *                       organizationAddress:
 *                         type: string
 *                         example: 123 University Ave, City, Country
 *                       organizationUrl:
 *                         type: string
 *                         example: http://www.abcuniversity.edu
 *                       designation:
 *                         type: string
 *                         example: Professor
 *                       fromDate:
 *                         type: string
 *                         format: date
 *                         example: "2010-01-01"
 *                       toDate:
 *                         type: string
 *                         format: date
 *                         example: "2020-01-01"
 *                       experienceIndustry:
 *                         type: string
 *                         example: Education
 *                       experienceProof:
 *                         type: string
 *                         example: proof.pdf
 *                 industryExperience:
 *                   type: string
 *                   example: "5 years and 3 months"
 *                   description: Total experience in industry.
 *                 teachingExperience:
 *                   type: string
 *                   example: "10 years and 6 months"
 *                   description: Total experience in teaching.
 *                 totalExperience:
 *                   type: string
 *                   example: "15 years and 9 months"
 *                   description: Total combined experience.
 *       400:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found!
 *       401:
 *         description: Invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid token
 *       403:
 *         description: Forbidden. Not a faculty member.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Forbidden. Not a faculty member
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

router.route("/experience").get(facultyAuthenticator, getExperienceData);

/**
 * @swagger
 * /common/research-profile:
 *   post:
 *     summary: Add or update faculty research profile
 *     description: Endpoint to add or update the research profile of an authenticated faculty member.
 *     tags:
 *       - Faculty
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: Bearer token for faculty authentication.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               department:
 *                 type: string
 *                 example: Computer Science
 *               designation:
 *                 type: string
 *                 example: Professor
 *               contact:
 *                 type: integer
 *                 example: 1234567890
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               googleScholarId:
 *                 type: string
 *                 example: ABC123
 *               googleScholarUrl:
 *                 type: string
 *                 example: https://scholar.google.com/citations?user=ABC123
 *               scopusId:
 *                 type: string
 *                 example: 12345
 *               scopusUrl:
 *                 type: string
 *                 example: https://www.scopus.com/authid/detail.uri?authorId=12345
 *               orcidId:
 *                 type: string
 *                 example: 0000-0001-2345-6789
 *               hIndexGoogleScholar:
 *                 type: string
 *                 example: 10
 *               hIndexScopus:
 *                 type: string
 *                 example: 8
 *               citationCountGoogleScholar:
 *                 type: integer
 *                 example: 500
 *               citationCountScopus:
 *                 type: integer
 *                 example: 300
 *               iTenIndexGoogleScholar:
 *                 type: string
 *                 example: 20
 *               iTenIndexScopus:
 *                 type: string
 *                 example: 15
 *     responses:
 *       200:
 *         description: Research profile added/updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *       400:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found!
 *       401:
 *         description: Invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid token
 *       403:
 *         description: Forbidden. Not a faculty member.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Forbidden. Not a faculty member
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
router.route("/research-profile").post(facultyAuthenticator, addResearchProfile);

/**
 * @swagger
 * /common/research-profile:
 *   get:
 *     summary: Retrieve faculty research profile
 *     description: Endpoint to retrieve the research profile of an authenticated faculty member.
 *     tags:
 *       - Faculty
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: Bearer token for faculty authentication.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Research profile data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 department:
 *                   type: string
 *                   example: Computer Science
 *                 designation:
 *                   type: string
 *                   example: Professor
 *                 contact:
 *                   type: integer
 *                   example: 1234567890
 *                 email:
 *                   type: string
 *                   example: john.doe@example.com
 *                 googleScholarId:
 *                   type: string
 *                   example: ABC123
 *                 googleScholarUrl:
 *                   type: string
 *                   example: https://scholar.google.com/citations?user=ABC123
 *                 scopusId:
 *                   type: string
 *                   example: 12345
 *                 scopusUrl:
 *                   type: string
 *                   example: https://www.scopus.com/authid/detail.uri?authorId=12345
 *                 orcidId:
 *                   type: string
 *                   example: 0000-0001-2345-6789
 *                 hIndexGoogleScholar:
 *                   type: string
 *                   example: 10
 *                 hIndexScopus:
 *                   type: string
 *                   example: 8
 *                 citationCountGoogleScholar:
 *                   type: integer
 *                   example: 500
 *                 citationCountScopus:
 *                   type: integer
 *                   example: 300
 *                 iTenIndexGoogleScholar:
 *                   type: string
 *                   example: 20
 *                 iTenIndexScopus:
 *                   type: string
 *                   example: 15
 *       400:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found!
 *       401:
 *         description: Invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid token
 *       403:
 *         description: Forbidden. Not a faculty member.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Forbidden. Not a faculty member
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
router.route("/research-profile").get(facultyAuthenticator, getResearchProfileData);

/**
 * @swagger
 * /common/patent:
 *   post:
 *     summary: Add new patent entry
 *     description: Endpoint to add a new patent entry by authenticated faculty members.
 *     tags:
 *       - Faculty
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: Bearer token for faculty authentication.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Novel Invention
 *               inventors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - John Doe
 *                   - Jane Smith
 *               affiliationInventors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - University A
 *                   - Company B
 *               departmentInvolved:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Computer Science
 *                   - Mechanical Engineering
 *               facultiesInvolved:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - john.doe@example.com
 *                   - jane.smith@example.com
 *               nationalInternational:
 *                 type: string
 *                 example: National
 *               country:
 *                 type: string
 *                 example: United States
 *               applicationNumber:
 *                 type: string
 *                 example: US20230123456A1
 *               filingDate:
 *                 type: string
 *                 format: date
 *                 example: "2023-06-25"
 *               grantDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *               patentCertificate:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Patent added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *       400:
 *         description: User not found or missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found or missing required fields
 *       401:
 *         description: Invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid token
 *       403:
 *         description: Forbidden. Not a faculty member.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Forbidden. Not a faculty member
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
router.route("/patent").post(facultyAuthenticator, patentFileUpload.single("patentCertificate"), addPatents);

/**
 * @swagger
 * /common/patent:
 *   get:
 *     summary: Get patents associated with the authenticated faculty member
 *     description: Retrieves the list of patents associated with the authenticated faculty member.
 *     tags:
 *       - Faculty
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: Bearer token for faculty authentication.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved patents.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 60d3aaba5f957a001f76a176
 *                   title:
 *                     type: string
 *                     example: Novel Invention
 *                   inventors:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example:
 *                         - John Doe
 *                         - Jane Smith
 *                   affiliationInventors:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example:
 *                         - University A
 *                         - Company B
 *                   departmentInvolved:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example:
 *                         - Computer Science
 *                         - Mechanical Engineering
 *                   facultiesInvolved:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example:
 *                         - john.doe@example.com
 *                         - jane.smith@example.com
 *                   nationalInternational:
 *                     type: string
 *                     example: National
 *                   country:
 *                     type: string
 *                     example: United States
 *                   applicationNumber:
 *                     type: string
 *                     example: US20230123456A1
 *                   filingDate:
 *                     type: string
 *                     format: date
 *                     example: "2023-06-25"
 *                   grantDate:
 *                     type: string
 *                     format: date
 *                     example: "2024-01-15"
 *                   patentCertificate:
 *                     type: string
 *                     example: /uploads/patents/patentCertificate.pdf
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2022-06-24T12:34:56.789Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2022-06-24T12:34:56.789Z"
 *       400:
 *         description: User not found or missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found or missing required fields
 *       401:
 *         description: Invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid token
 *       403:
 *         description: Forbidden. Not a faculty member.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Forbidden. Not a faculty member
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
router.route('/patent').get(facultyAuthenticator, getPatentData)

/**
 * @swagger
 * /common/copyright:
 *   post:
 *     summary: Add a new copyright entry
 *     description: Creates a new copyright entry for the authenticated faculty member.
 *     tags:
 *       - Faculty
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: Bearer token for faculty authentication.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Copyrighted Work
 *               inventors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - John Doe
 *                   - Jane Smith
 *               affiliationInventors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - University A
 *                   - Company B
 *               departmentInvolved:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Computer Science
 *                   - Arts
 *               facultiesInvolved:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - john.doe@example.com
 *                   - jane.smith@example.com
 *               nationalInternational:
 *                 type: string
 *                 example: International
 *               country:
 *                 type: string
 *                 example: United States
 *               applicationNumber:
 *                 type: string
 *                 example: US20230123456A1
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2023-06-25"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-06-25"
 *               copyrightCertificate:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Copyright entry added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *       400:
 *         description: User not found or missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found or missing required fields
 *       401:
 *         description: Invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid token
 *       403:
 *         description: Forbidden. Not a faculty member.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Forbidden. Not a faculty member
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
router.route("/copyright").post(facultyAuthenticator, copyrightFileUpload.single("copyrightCertificate"), addCopyright);

/**
 * @swagger
 * /common/copyright:
 *   get:
 *     summary: Get copyright data for authenticated faculty member
 *     description: Retrieves copyright data associated with the authenticated faculty member.
 *     tags:
 *       - Faculty
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: Bearer token for faculty authentication.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Copyright data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 60d1f70c0e3f000015b5f5b1
 *                   title:
 *                     type: string
 *                     example: Copyrighted Work
 *                   inventors:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - John Doe
 *                       - Jane Smith
 *                   affiliationInventors:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - University A
 *                       - Company B
 *                   departmentInvolved:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - Computer Science
 *                       - Arts
 *                   facultiesInvolved:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - john.doe@example.com
 *                       - jane.smith@example.com
 *                   nationalInternational:
 *                     type: string
 *                     example: International
 *                   country:
 *                     type: string
 *                     example: United States
 *                   applicationNumber:
 *                     type: string
 *                     example: US20230123456A1
 *                   startDate:
 *                     type: string
 *                     format: date
 *                     example: "2023-06-25"
 *                   endDate:
 *                     type: string
 *                     format: date
 *                     example: "2024-06-25"
 *                   copyrightCertificate:
 *                     type: string
 *                     example: /uploads/copyright/certificate.pdf
 *       400:
 *         description: User not found or missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found or missing required fields
 *       401:
 *         description: Invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid token
 *       403:
 *         description: Forbidden. Not a faculty member.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Forbidden. Not a faculty member
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
router.route('/copyright').get(facultyAuthenticator, getCopyrightData)

router.route("/book").post(facultyAuthenticator, bookFileUpload.single("proof"), addBook);

router.route("/journal").post(facultyAuthenticator, journalFileUpload.fields([
  { name: "paper", maxCount: 1 },
  { name: "certificate", maxCount: 1 },
]),
  addJournal
);


router.route("/conference").post(facultyAuthenticator, conferenceFileUpload.fields([
  { name: "paper", maxCount: 1 },
  { name: "certificate", maxCount: 1 },
]),
  addConference
);

router.route("/book-chapter").post(facultyAuthenticator, bookChapterUpload.single("proof"), addBookChapter);

module.exports = router;
