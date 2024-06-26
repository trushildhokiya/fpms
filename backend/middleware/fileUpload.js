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
 * Faculty PROFILE IMAGE UPLOAD
 */

const facultyProfileImageStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const destinationPath = path.join("uploads", "profileImage", "faculty");

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

const facultyProfileImageUpload = multer({ storage: facultyProfileImageStorage });

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
COPYRIGHTS FILE UPLOAD
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
 CONFERENCE FILE UPLOAD
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
BOOK CHAPTER FILE UPLOAD 
*/
const bookChapterFileStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const destinationPath = path.join("uploads", "book-chapter");

    await ensureDirectoryExists(destinationPath);

    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      "bookchapterproof" + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const bookChapterUpload = multer({ storage: bookChapterFileStorage });


/*
NEED BASED PROJECT FILE UPLOAD 
*/
const needBasedProjectStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const destinationPath = path.join("uploads", "need-based-projects");

    await ensureDirectoryExists(destinationPath);

    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      "needBproject-file" + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const needBasedProjectFileUpload = multer({ storage: needBasedProjectStorage });

/*
AWARD HONORS FILE UPLOAD 
*/
const awardHonorsFileStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const destinationPath = path.join("uploads", "award-honors");

    await ensureDirectoryExists(destinationPath);

    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      "award-honors-proof" + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const awardHonorsFileUpload = multer({ storage: awardHonorsFileStorage });

/*
CONSULTANCY FILE UPLOAD 
*/
const consultancyFileStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const destinationPath = path.join("uploads", "consultancy");

    await ensureDirectoryExists(destinationPath);

    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      "consultancy-proof" + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const consultancyFileUpload = multer({ storage: consultancyFileStorage });

/*
PROJECT FILE UPLOAD 
*/
const projectFileStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const destinationPath = path.join("uploads", "project");

    await ensureDirectoryExists(destinationPath);

    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      "project-proof" + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const projectFileUpload = multer({ storage: projectFileStorage });



module.exports = {
  adminProfileImageUpload,
  facultyProfileImageUpload,
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
  projectFileUpload
};
