const mongoose = require("mongoose");

// Define Mongoose schema for bookChapter
const sttpAttendedSchema = new mongoose.Schema(
  {
    sttpTitle: {
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

    level: {
        type: String,
        required: true,
    },

    venue: {
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

    numberOfDays: {
        type: Number,
        required: true,
    },

    remarks: {
        type: String,
        required: true,
    },

    certUpload: {
        type: String,
        required: true,
    },
    
  },
  { timestamps: true }
);

// Compile the schema into a model
module.exports = mongoose.model("sttp-attended", sttpAttendedSchema);
