const multer = require("multer");
const fs = require("fs");
const path = require("path");
const uuid = require('uuid')

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
    cb(
      null,
      file.fieldname + "-" + uuid.v7() + path.extname(file.originalname)
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
    cb(
      null,
      file.fieldname + "-" + uuid.v7() + path.extname(file.originalname)
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
    cb(
      null,
      "experience-proof" + "-" + uuid.v7() + path.extname(file.originalname)
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
    cb(
      null,
      "patent-proof-" + uuid.v7() + path.extname(file.originalname)
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
    cb(
      null,
      "book-proof-" + uuid.v7() + path.extname(file.originalname)
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
    cb(
      null,
      "journal-proof" + "-" + uuid.v7() + path.extname(file.originalname)
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
    cb(
      null,
      "copyright-proof" + "-" + uuid.v7() + path.extname(file.originalname)
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
    cb(
      null,
      "conference-proof" + "-" + uuid.v7() + path.extname(file.originalname)
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
    cb(
      null,
      "book-chapter-proof" + "-" + uuid.v7() + path.extname(file.originalname)
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
    cb(
      null,
      "need-based-project-proof" + "-" + uuid.v7() + path.extname(file.originalname)
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
    cb(
      null,
      "award-honors-proof" + "-" + uuid.v7() + path.extname(file.originalname)
    );
  },
});

const awardHonorsFileUpload = multer({ storage: awardHonorsFileStorage });

/*
AWARD RECEIVED FILE UPLOAD 
*/
const awardsReceivedFileStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const destinationPath = path.join("uploads", "awards-recieved");

    await ensureDirectoryExists(destinationPath);

    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      "awards-received-proof" + "-" + uuid.v7() + path.extname(file.originalname)
    );
  },
});

const awardsReceivedFileUpload = multer({ storage: awardsReceivedFileStorage });

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
    cb(
      null,
      "consultancy-proof" + "-" + uuid.v7() + path.extname(file.originalname)
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
    cb(
      null,
      "project-proof" + "-" + uuid.v7() + path.extname(file.originalname)
    );
  },
});

const projectFileUpload = multer({ storage: projectFileStorage });


/*
QUALIFICATION FILE UPLOAD 
*/

const qualificationFileStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    
    const destinationPath = path.join("uploads", "qualification");

    await ensureDirectoryExists(destinationPath);

    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      "qualification-proof" + "-" + uuid.v7() + path.extname(file.originalname)
    );
  },
});

const qualificationFileUpload = multer({ storage: qualificationFileStorage });

/*
DEBUGGING FILE UPLOAD 
*/

const debugFileStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const destinationPath = path.join("uploads", "debug");

    await ensureDirectoryExists(destinationPath);

    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      "debug-proof" + "-" + uuid.v7() + path.extname(file.originalname)
    );
  },
});

const debugFileUpload = multer({ storage: debugFileStorage });



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
  awardsReceivedFileUpload,
  consultancyFileUpload,
  projectFileUpload,
  qualificationFileUpload,
  debugFileUpload
};
