const mongoose = require("mongoose");

// Define Mongoose schema for Course Certification
const CourseCertificationSchema = new mongoose.Schema(
  {
    
    title: {
      type: String,
      required: true,
    },

    organizedBy: {
      type: String,
      required: true,
    },

    venue: {
      type: String,
      required: true,
    },

    associationWith: {
      type: String,
      required: true,
    },

    mode: {
      type: String,
      required: true,
    },

    fromDate: {
      type: Date,
      required: true,
    },

    toDate: {
      type: Date,
      required: true,
    },

    totalDays: {
      type: Number,
      required: true,
    },

    level: {
      type: String,
      required: true,
    },

    remarks: {
      type: String,
      required: true,
    },

    certificate: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Compile the schema into a model
const CourseCertification = mongoose.model("courseCertification", CourseCertificationSchema);
module.exports = CourseCertification;
