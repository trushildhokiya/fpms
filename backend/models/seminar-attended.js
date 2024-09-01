const mongoose = require("mongoose");

// Define Mongoose schema for bookChapter
const seminarAttendedSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    organizedBy: {
        type: String,
        required: true,
    },

    associationWith: {
        type: String,
        required: true,
    },

    type: {
        type: String,
        required: true,
    },

    mode: {
        type: String,
        required: true,
    },

    venue: {
        type: String,
        required: true,
    },

    level: {
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

    remarks: {
        type: String,
        required: true,
    },

    certificate: {
        type: String,
        required: true,
    },

    photos: {
        type: String,
        required: true,
    },
    
  },
  { timestamps: true }
);

// Compile the schema into a model
module.exports = mongoose.model("seminarAttended", seminarAttendedSchema);
