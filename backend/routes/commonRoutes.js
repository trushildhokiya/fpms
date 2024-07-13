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
  getJournalData,
  getConferenceData,
  getBookData,
  getBookChapterData,
  addNeedBasedProject,
  getNeedBasedProjectData,
  addAwardHonors,
  getAwardHonorsData,
  addConsultancy,
  getConsultancyData,
  addProject,
  getProjectsData,
  profileImageUpdate,
  deletePatent,
  deleteCopyright,
  deleteJournal,
  deleteConference,
  deleteBook,
  deleteBookChapter,
  deleteAwardsHonors,
  deleteProject,
  deleteConsultancy,
  deleteNeedBasedProject,
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
  needBasedProjectFileUpload,
  awardHonorsFileUpload,
  consultancyFileUpload,
  projectFileUpload,
  facultyProfileImageUpload,
} = require("../middleware/fileUpload");
const router = express.Router();



/**
 * @swagger
 * /head/profile/image:
 *   put:
 *     summary: Update Head Profile Image
 *     description: Update the profile image for the faculty.
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
 *       - in: header
 *         name: email
 *         required: true
 *         description: Email of the faculty.
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
 *         description: Successfully updated faculty profile image.
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

router.route('/profile/image').put(facultyAuthenticator, facultyProfileImageUpload.single('profileImage'), profileImageUpdate)


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

router.route('/patent').delete(facultyAuthenticator,deletePatent)

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


router.route('/copyright').delete(facultyAuthenticator,deleteCopyright)

/**
 * @swagger
 * /common/journal:
 *   post:
 *     summary: Add new journal entry
 *     description: Endpoint to add a new journal entry by authenticated faculty members.
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
 *                 example: An Innovative Research Paper
 *               authors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Dr. John Doe
 *                   - Dr. Jane Smith
 *               authorsAffiliation:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - University A
 *                   - University B
 *               departmentInvolved:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Computer Science
 *                   - Electrical Engineering
 *               paidUnpaid:
 *                 type: string
 *                 example: Paid
 *               facultiesInvolved:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - john.doe@example.com
 *                   - jane.smith@example.com
 *               journalType:
 *                 type: string
 *                 example: International
 *               journalTitle:
 *                 type: string
 *                 example: Journal of Advanced Research
 *               issn:
 *                 type: string
 *                 example: 1234-5678
 *               impactFactor:
 *                 type: number
 *                 example: 4.5
 *               pageFrom:
 *                 type: number
 *                 example: 1
 *               pageTo:
 *                 type: number
 *                 example: 15
 *               dateOfPublication:
 *                 type: string
 *                 format: date
 *                 example: "2024-06-27"
 *               digitalObjectIdentifier:
 *                 type: string
 *                 example: 10.1234/jar.2024.001
 *               indexing:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Scopus
 *                   - Web of Science
 *               paperUrl:
 *                 type: string
 *                 example: https://example.com/paper.pdf
 *               citationCount:
 *                 type: number
 *                 example: 10
 *               paper:
 *                 type: string
 *                 format: binary
 *               certificate:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Journal entry added successfully.
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
router.route("/journal").post(facultyAuthenticator, journalFileUpload.fields([
  { name: "paper", maxCount: 1 },
  { name: "certificate", maxCount: 1 },
]),
  addJournal
);


/**
 * @swagger
 * /common/journal:
 *   get:
 *     summary: Get journal entries
 *     description: Endpoint to retrieve journal entries for authenticated faculty members.
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
 *         description: Journal entries retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 60b8d6f8d3b3c823d8c0e8f1
 *                   title:
 *                     type: string
 *                     example: An Innovative Research Paper
 *                   authors:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - Dr. John Doe
 *                       - Dr. Jane Smith
 *                   authorsAffiliation:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - University A
 *                       - University B
 *                   departmentInvolved:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - Computer Science
 *                       - Electrical Engineering
 *                   paidUnpaid:
 *                     type: string
 *                     example: Paid
 *                   facultiesInvolved:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - john.doe@example.com
 *                       - jane.smith@example.com
 *                   journalType:
 *                     type: string
 *                     example: International
 *                   journalTitle:
 *                     type: string
 *                     example: Journal of Advanced Research
 *                   issn:
 *                     type: string
 *                     example: 1234-5678
 *                   impactFactor:
 *                     type: number
 *                     example: 4.5
 *                   pageFrom:
 *                     type: number
 *                     example: 1
 *                   pageTo:
 *                     type: number
 *                     example: 15
 *                   dateOfPublication:
 *                     type: string
 *                     format: date
 *                     example: "2024-07-01"
 *                   digitalObjectIdentifier:
 *                     type: string
 *                     example: 10.1234/jar.2024.001
 *                   indexing:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - Scopus
 *                       - Web of Science
 *                   paperUrl:
 *                     type: string
 *                     example: https://example.com/paper.pdf
 *                   citationCount:
 *                     type: number
 *                     example: 10
 *                   paper:
 *                     type: string
 *                     example: /uploads/papers/60b8d6f8d3b3c823d8c0e8f1.pdf
 *                   certificate:
 *                     type: string
 *                     example: /uploads/certificates/60b8d6f8d3b3c823d8c0e8f1.pdf
 *       400:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
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
router.route("/journal").get(facultyAuthenticator, getJournalData)

router.route('/journal').delete(facultyAuthenticator,deleteJournal)


/**
 * @swagger
 * /common/conference:
 *   post:
 *     summary: Add new conference entry
 *     description: Endpoint to add a new conference entry by authenticated faculty members.
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
 *                 example: Cutting-Edge Research in AI
 *               authors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Dr. John Doe
 *                   - Dr. Jane Smith
 *               authorsAffiliation:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - University A
 *                   - University B
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
 *                 example: International
 *               conferenceName:
 *                 type: string
 *                 example: International Conference on AI
 *               venue:
 *                 type: string
 *                 example: New York, USA
 *               organizer:
 *                 type: string
 *                 example: AI Research Society
 *               role:
 *                 type: string
 *                 example: Presenter
 *               fromDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-06-25"
 *               toDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-06-27"
 *               paperStatus:
 *                 type: string
 *                 example: Accepted
 *               publicationDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-07-01"
 *               issn:
 *                 type: string
 *                 example: 1234-5678
 *               impactFactor:
 *                 type: number
 *                 example: 3.5
 *               pageNo:
 *                 type: string
 *                 example: 12-19
 *               yearOfPublication:
 *                 type: number
 *                 example: 2024
 *               doi:
 *                 type: string
 *                 example: 10.1234/ai.2024.001
 *               indexing:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Scopus
 *                   - Web of Science
 *               paperUrl:
 *                 type: string
 *                 example: https://example.com/paper.pdf
 *               citationCount:
 *                 type: number
 *                 example: 5
 *               paper:
 *                 type: string
 *                 format: binary
 *               certificate:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Conference entry added successfully.
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
router.route("/conference").post(facultyAuthenticator, conferenceFileUpload.fields([
  { name: "paper", maxCount: 1 },
  { name: "certificate", maxCount: 1 },
]),
  addConference
);

/**
 * @swagger
 * /common/conference:
 *   get:
 *     summary: Get conference data
 *     description: Endpoint to retrieve conference data for an authenticated faculty member.
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
 *         description: Conference data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     example: Cutting-Edge Research in AI
 *                   authors:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - Dr. John Doe
 *                       - Dr. Jane Smith
 *                   authorsAffiliation:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - University A
 *                       - University B
 *                   departmentInvolved:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - Computer Science
 *                       - Mechanical Engineering
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
 *                   conferenceName:
 *                     type: string
 *                     example: International Conference on AI
 *                   venue:
 *                     type: string
 *                     example: New York, USA
 *                   organizer:
 *                     type: string
 *                     example: AI Research Society
 *                   role:
 *                     type: string
 *                     example: Presenter
 *                   fromDate:
 *                     type: string
 *                     format: date
 *                     example: "2024-06-25"
 *                   toDate:
 *                     type: string
 *                     format: date
 *                     example: "2024-06-27"
 *                   paperStatus:
 *                     type: string
 *                     example: Accepted
 *                   publicationDate:
 *                     type: string
 *                     format: date
 *                     example: "2024-07-01"
 *                   issn:
 *                     type: string
 *                     example: 1234-5678
 *                   impactFactor:
 *                     type: number
 *                     example: 3.5
 *                   pageNo:
 *                     type: string
 *                     example: 12-19
 *                   yearOfPublication:
 *                     type: number
 *                     example: 2024
 *                   doi:
 *                     type: string
 *                     example: 10.1234/ai.2024.001
 *                   indexing:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - Scopus
 *                       - Web of Science
 *                   paperUrl:
 *                     type: string
 *                     example: https://example.com/paper.pdf
 *                   citationCount:
 *                     type: number
 *                     example: 5
 *                   paper:
 *                     type: string
 *                   certificate:
 *                     type: string
 *       400:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
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
router.route("/conference").get(facultyAuthenticator, getConferenceData)

router.route('/conference').delete(facultyAuthenticator,deleteConference)

/**
 * @swagger
 * /common/book:
 *   post:
 *     summary: Add new book entry
 *     description: Endpoint to add a new book entry by authenticated faculty members.
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
 *               bookTitle:
 *                 type: string
 *                 example: Advanced Machine Learning
 *               authors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - John Doe
 *                   - Jane Smith
 *               authorsAffiliation:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - University A
 *                   - University B
 *               departmentInvolved:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Computer Science
 *                   - Mathematics
 *               facultiesInvolved:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - john.doe@example.com
 *                   - jane.smith@example.com
 *               publisherName:
 *                 type: string
 *                 example: Springer
 *               nationalInternational:
 *                 type: string
 *                 example: International
 *               issn:
 *                 type: string
 *                 example: 1234-5678
 *               impactFactor:
 *                 type: number
 *                 example: 2.5
 *               dateOfPublication:
 *                 type: string
 *                 format: date
 *                 example: "2024-06-27"
 *               doi:
 *                 type: string
 *                 example: 10.1234/book.2024.001
 *               intendedAudience:
 *                 type: string
 *                 example: Researchers and Practitioners
 *               description:
 *                 type: string
 *                 example: This book covers advanced topics in machine learning.
 *               indexing:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Scopus
 *                   - Web of Science
 *               bookUrl:
 *                 type: string
 *                 example: https://example.com/book.pdf
 *               citationCount:
 *                 type: number
 *                 example: 10
 *               proof:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Book added successfully.
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
router.route("/book").post(facultyAuthenticator, bookFileUpload.single("proof"), addBook);

/**
 * @swagger
 * /common/book:
 *   get:
 *     summary: Get book data
 *     description: Endpoint to retrieve book data for an authenticated faculty member.
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
 *         description: Successfully retrieved book data.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   bookTitle:
 *                     type: string
 *                     example: Advanced Machine Learning
 *                   authors:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - John Doe
 *                       - Jane Smith
 *                   authorsAffiliation:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - University A
 *                       - University B
 *                   departmentInvolved:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - Computer Science
 *                       - Mathematics
 *                   facultiesInvolved:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - john.doe@example.com
 *                       - jane.smith@example.com
 *                   publisherName:
 *                     type: string
 *                     example: Springer
 *                   nationalInternational:
 *                     type: string
 *                     example: International
 *                   issn:
 *                     type: string
 *                     example: 1234-5678
 *                   impactFactor:
 *                     type: number
 *                     example: 2.5
 *                   dateOfPublication:
 *                     type: string
 *                     format: date
 *                     example: "2024-06-27"
 *                   doi:
 *                     type: string
 *                     example: 10.1234/book.2024.001
 *                   intendedAudience:
 *                     type: string
 *                     example: Researchers and Practitioners
 *                   description:
 *                     type: string
 *                     example: This book covers advanced topics in machine learning.
 *                   indexing:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - Scopus
 *                       - Web of Science
 *                   bookUrl:
 *                     type: string
 *                     example: https://example.com/book.pdf
 *                   citationCount:
 *                     type: number
 *                     example: 10
 *                   proof:
 *                     type: string
 *                     example: /uploads/proof.pdf
 *       400:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
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
router.route('/book').get(facultyAuthenticator, getBookData)

router.route('/book').delete(facultyAuthenticator,deleteBook)

/**
 * @swagger
 * /common/book-chapter:
 *   post:
 *     summary: Add new book chapter entry
 *     description: Endpoint to add a new book chapter entry by authenticated faculty members.
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
 *               bookTitle:
 *                 type: string
 *                 example: Advanced Topics in Computer Science
 *               chapterTitle:
 *                 type: string
 *                 example: Introduction to Quantum Computing
 *               authors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - John Doe
 *                   - Jane Smith
 *               authorsAffiliation:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - University A
 *                   - University B
 *               departmentInvolved:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Computer Science
 *                   - Physics
 *               facultiesInvolved:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - john.doe@example.com
 *                   - jane.smith@example.com
 *               publisherName:
 *                 type: string
 *                 example: Springer
 *               nationalInternational:
 *                 type: string
 *                 example: International
 *               issn:
 *                 type: string
 *                 example: 1234-5678
 *               impactFactor:
 *                 type: number
 *                 example: 3.5
 *               dateOfPublication:
 *                 type: string
 *                 format: date
 *                 example: "2024-06-27"
 *               doi:
 *                 type: string
 *                 example: 10.1234/book.2024.001
 *               indexing:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Scopus
 *                   - Web of Science
 *               intendedAudience:
 *                 type: string
 *                 example: Researchers and Practitioners
 *               description:
 *                 type: string
 *                 example: This chapter covers the basics of quantum computing.
 *               bookUrl:
 *                 type: string
 *                 example: https://example.com/book-chapter.pdf
 *               citationCount:
 *                 type: number
 *                 example: 10
 *               proof:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Book chapter added successfully.
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
router.route("/book-chapter").post(facultyAuthenticator, bookChapterUpload.single("proof"), addBookChapter);

/**
 * @swagger
 * /common/book-chapter:
 *   get:
 *     summary: Retrieve book chapter data
 *     description: Endpoint to retrieve book chapter data for authenticated faculty members.
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
 *         description: Successfully retrieved book chapter data.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 60dfdbbf086f112154d93bea
 *                   bookTitle:
 *                     type: string
 *                     example: Advanced Topics in Computer Science
 *                   chapterTitle:
 *                     type: string
 *                     example: Introduction to Quantum Computing
 *                   authors:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - John Doe
 *                       - Jane Smith
 *                   authorsAffiliation:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - University A
 *                       - University B
 *                   departmentInvolved:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - Computer Science
 *                       - Physics
 *                   facultiesInvolved:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - john.doe@example.com
 *                       - jane.smith@example.com
 *                   publisherName:
 *                     type: string
 *                     example: Springer
 *                   nationalInternational:
 *                     type: string
 *                     example: International
 *                   issn:
 *                     type: string
 *                     example: 1234-5678
 *                   impactFactor:
 *                     type: number
 *                     example: 3.5
 *                   dateOfPublication:
 *                    type: string
 *                    format: date
 *                    example: "2024-06-27"
 *                   doi:
 *                     type: string
 *                     example: 10.1234/book.2024.001
 *                   indexing:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - Scopus
 *                       - Web of Science
 *                   intendedAudience:
 *                     type: string
 *                     example: Researchers and Practitioners
 *                   description:
 *                     type: string
 *                     example: This chapter covers the basics of quantum computing.
 *                   bookUrl:
 *                     type: string
 *                     example: https://example.com/book-chapter.pdf
 *                   citationCount:
 *                     type: number
 *                     example: 10
 *                   proof:
 *                     type: string
 *                     example: /uploads/book-chapter/proof123.pdf
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
router.route('/book-chapter').get(facultyAuthenticator, getBookChapterData)

router.route('/book-chapter').delete(facultyAuthenticator,deleteBookChapter)

/**
 * @swagger
 * /common/need-based-project:
 *   post:
 *     summary: Add new need-based project entry
 *     description: Endpoint to add a new need-based project entry by authenticated faculty members.
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
 *               projectTitle:
 *                 type: string
 *                 example: Community Development Project
 *               description:
 *                 type: string
 *                 example: A project aimed at improving community health.
 *               outcomes:
 *                 type: string
 *                 example: Improved access to healthcare services.
 *               institutionAddress:
 *                 type: string
 *                 example: 123 Main Street, City, Country
 *               departmentInvolved:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Public Health
 *                   - Social Work
 *               facultiesInvolved:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - john.doe@example.com
 *                   - jane.smith@example.com
 *               institutionName:
 *                 type: string
 *                 example: ABC Foundation
 *               facultyCoordinatorName:
 *                 type: string
 *                 example: John Doe
 *               facultyCoordinatorDepartment:
 *                 type: string
 *                 example: Public Health
 *               facultyCoordinatorContact:
 *                 type: string
 *                 example: +1234567890
 *               facultyCoordinatorEmail:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               students:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Alice Smith
 *                     department:
 *                       type: string
 *                       example: Nursing
 *                     contact:
 *                       type: string
 *                       example: +9876543210
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: alice.smith@example.com
 *                 example:
 *                   - name: Alice Smith
 *                     department: Nursing
 *                     contact: +9876543210
 *                     email: alice.smith@example.com
 *               collaborationType:
 *                 type: string
 *                 example: Academic-Community Partnership
 *               institutionUrl:
 *                 type: string
 *                 example: https://abc-foundation.org
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-08-01T00:00:00Z
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-12-31T23:59:59Z
 *               sanctionedDocuments:
 *                 type: string
 *                 format: binary
 *               projectReport:
 *                 type: string
 *                 format: binary
 *               completionLetter:
 *                 type: string
 *                 format: binary
 *               visitDocuments:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Need-based project added successfully.
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
router.route('/need-based-project').post(facultyAuthenticator, needBasedProjectFileUpload.fields([
  { name: 'sanctionedDocuments', maxCount: 1 },
  { name: 'projectReport', maxCount: 1 },
  { name: 'completionLetter', maxCount: 1 },
  { name: 'visitDocuments', maxCount: 1 },
]), addNeedBasedProject)

/**
 * @swagger
 * /common/need-based-project:
 *   get:
 *     summary: Get need-based projects associated with authenticated faculty member
 *     description: Endpoint to retrieve need-based projects associated with the authenticated faculty member.
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
 *         description: List of need-based projects retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 60fd3213b94ebf001b82041d
 *                   projectTitle:
 *                     type: string
 *                     example: Community Development Project
 *                   description:
 *                     type: string
 *                     example: A project aimed at improving community health.
 *                   outcomes:
 *                     type: string
 *                     example: Improved access to healthcare services.
 *                   institutionAddress:
 *                     type: string
 *                     example: 123 Main Street, City, Country
 *                   departmentInvolved:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - Public Health
 *                       - Social Work
 *                   facultiesInvolved:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - john.doe@example.com
 *                       - jane.smith@example.com
 *                   institutionName:
 *                     type: string
 *                     example: ABC Foundation
 *                   facultyCoordinatorName:
 *                     type: string
 *                     example: John Doe
 *                   facultyCoordinatorDepartment:
 *                     type: string
 *                     example: Public Health
 *                   facultyCoordinatorContact:
 *                     type: string
 *                     example: +1234567890
 *                   facultyCoordinatorEmail:
 *                     type: string
 *                     format: email
 *                     example: john.doe@example.com
 *                   students:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: Alice Smith
 *                         department:
 *                           type: string
 *                           example: Nursing
 *                         contact:
 *                           type: string
 *                           example: +9876543210
 *                         email:
 *                           type: string
 *                           format: email
 *                           example: alice.smith@example.com
 *                     example:
 *                       - name: Alice Smith
 *                         department: Nursing
 *                         contact: +9876543210
 *                         email: alice.smith@example.com
 *                   collaborationType:
 *                     type: string
 *                     example: Academic-Community Partnership
 *                   institutionUrl:
 *                     type: string
 *                     example: https://abc-foundation.org
 *                   startDate:
 *                     type: string
 *                     format: date-time
 *                     example: 2024-08-01T00:00:00Z
 *                   endDate:
 *                     type: string
 *                     format: date-time
 *                     example: 2024-12-31T23:59:59Z
 *                   sanctionedDocuments:
 *                     type: string
 *                     example: /uploads/sanctionedDoc.pdf
 *                   projectReport:
 *                     type: string
 *                     example: /uploads/projectReport.pdf
 *                   completionLetter:
 *                     type: string
 *                     example: /uploads/completionLetter.pdf
 *                   visitDocuments:
 *                     type: string
 *                     example: /uploads/visitDocuments.pdf
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
router.route('/need-based-project').get(facultyAuthenticator, getNeedBasedProjectData)

router.route('/need-based-project').delete(facultyAuthenticator,deleteNeedBasedProject)


router.route('/award-honors').post(facultyAuthenticator, awardHonorsFileUpload.single('proof'), addAwardHonors)

router.route('/award-honors').get(facultyAuthenticator, getAwardHonorsData)

router.route('/award-honors').delete(facultyAuthenticator,deleteAwardsHonors)

router.route('/consultancy').post(facultyAuthenticator, consultancyFileUpload.fields([
  { name: 'sanctionedOrder', maxCount: 1 },
  { name: 'transactionProof', maxCount: 1 },
  { name: 'completionCertificate', maxCount: 1 },
  { name: 'supportingDocuments', maxCount: 1 },
]), addConsultancy)


router.route('/consultancy').get(facultyAuthenticator, getConsultancyData)

router.route('/consultancy').delete(facultyAuthenticator,deleteConsultancy)


router.route('/projects').post(facultyAuthenticator, projectFileUpload.fields([
  { name: 'sanctionedOrder', maxCount: 1 },
  { name: 'transactionProof', maxCount: 1 },
  { name: 'completionCertificate', maxCount: 1 },
  { name: 'supportingDocuments', maxCount: 1 },
]), addProject)


router.route('/projects').get(facultyAuthenticator, getProjectsData)

router.route('/projects').delete(facultyAuthenticator,deleteProject)

module.exports = router;
