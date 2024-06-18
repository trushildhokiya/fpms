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
} = require("../controller/commonController");

//add the file upload modules here
const {
  experienceFileUpload,
  patentFileUpload,
  bookFileUpload,
  journalFileUpload,
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

router.route("/profile").get(facultyAuthenticator, getProfileData);

router
  .route("/experience")
  .post(
    facultyAuthenticator,
    experienceFileUpload.any("experienceProof"),
    addExperience
  );

router.route("/experience").get(facultyAuthenticator, getExperienceData);

router
  .route("/research-profile")
  .post(facultyAuthenticator, addResearchProfile);

router
  .route("/research-profile")
  .get(facultyAuthenticator, getResearchProfileData);

/*
ROUTES PATENT
*/

//IF you have single file input -> use single
router
  .route("/patent")
  .post(
    facultyAuthenticator,
    patentFileUpload.single("patentCertificate"),
    addPatents
  );

/*
ROUTES BOOK
*/
router
  .route("/book")
  .post(facultyAuthenticator, bookFileUpload.single("proof"), addBook);

/*
ROUTES JOURNAL
*/

//IF you have multiple file inputs -> use fields
router.route("/journal").post(
  facultyAuthenticator,
  journalFileUpload.fields([
    { name: "paper", maxCount: 1 },
    { name: "certificate", maxCount: 1 },
  ]),
  addJournal
);

/*
ROUTES COPYRIGHTS
*/

/*
ROUTES MAJOR/MINOR
*/

/*
ROUTES NEED BASED
*/

/*
ROUTES AWARDS & HONORS
*/

/*
ROUTES CONSULTANCY
*/

/*
ROUTES CONFERENCE
*/

/*
ROUTES BOOK CHAPTER
*/

module.exports = router;
