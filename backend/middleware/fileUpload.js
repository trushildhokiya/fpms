const multer = require("multer");
const fs = require("fs");
const path = require("path");

const ensureDirectoryExists = async (directory) => {
  try {
    await fs.promises.mkdir(directory, { recursive: true });
  } catch (error) {
    console.error("Error creating directory:", error);
  }
};

/**
 * ADMIN PROFILE IMAGE UPLOAD
 */
const adminProfileImageStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const destinationPath = path.join("uploads", "profileImage", "admin");

    await ensureDirectoryExists(destinationPath);

    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const adminProfileImageUpload = multer({ storage: adminProfileImageStorage });

/**
 * HEAD PROFILE IMAGE UPLOAD
 */

const headProfileImageStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const destinationPath = path.join("uploads", "profileImage", "head");

    await ensureDirectoryExists(destinationPath);

    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const headProfileImageUpload = multer({ storage: headProfileImageStorage });

/**
 * EXPERIENCE FILE UPLOAD
 */
const experienceFileStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const destinationPath = path.join("uploads", "experience");

    await ensureDirectoryExists(destinationPath);

    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      "experienceproof" + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const experienceFileUpload = multer({ storage: experienceFileStorage });

/**
 * PATENT FILE UPLOAD
 */
const patentFileStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const destinationPath = path.join("uploads", "patent");

    await ensureDirectoryExists(destinationPath);

    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      "patentproof" + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const patentFileUpload = multer({ storage: patentFileStorage });

/**
 * BOOK FILE UPLOAD
 */
const bookFileStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const destinationPath = path.join("uploads", "book");

    await ensureDirectoryExists(destinationPath);

    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      "bookproof" + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const bookFileUpload = multer({ storage: bookFileStorage });

/**
 * JOURNAL FILE UPLOAD
 */
const journalFileStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const destinationPath = path.join("uploads", "journal");

    await ensureDirectoryExists(destinationPath);

    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      "journalproof" + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const journalFileUpload = multer({ storage: journalFileStorage });

/*
FILE UPLOAD COPYRIGHTS
*/
const copyrightFileStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const destinationPath = path.join("uploads", "copyright");

    await ensureDirectoryExists(destinationPath);

    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      "copyrightproof" + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const copyrightFileUpload = multer({ storage: copyrightFileStorage });

/*
FILE UPLOAD MAJOR/MINOR
*/

/*
FILE UPLOAD NEED BASED
*/

/*
FILE UPLOAD AWARDS & HONORS
*/

/*
FILE UPLOAD CONSULTANCY
*/

/*
FILE UPLOAD CONFERENCE
*/
const conferenceFileStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const destinationPath = path.join("uploads", "conference");

    await ensureDirectoryExists(destinationPath);

    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      "conferenceproof" + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const conferenceFileUpload = multer({ storage: conferenceFileStorage });

/*
FILE UPLOAD BOOK CHAPTER
*/

module.exports = {
  adminProfileImageUpload,
  headProfileImageUpload,
  experienceFileUpload,
  patentFileUpload,
  bookFileUpload,
  journalFileUpload,
  conferenceFileUpload,
  copyrightFileUpload,
};
