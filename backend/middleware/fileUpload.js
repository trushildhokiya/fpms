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

module.exports = {
  adminProfileImageUpload,
  headProfileImageUpload,
  experienceFileUpload,
  patentFileUpload,
};
