const mongoose = require("mongoose");

// Define Mongoose schema for bookChapter
const seminarConductedSchema = new mongoose.Schema(
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

    programConductedType: {
        type: String,
        required: true,
    },

    programConductedMode: {
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

    level: {
        type: String,
        required: true,
    },

    numberOfParticipants: {
        type: String,
        required: true
    },

    venue: {
        type: String,
        required: true,
    },

    remarks: {
        type: String,
        required: true,
    },
    
    invitationLetterUpload: {
        type: String,
        required: true,
    },

    completionCertificateUpload: {
        type: String,
        required: true,
    },

    photoUpload: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Compile the schema into a model
const SeminarConducted = mongoose.model("seminarConducted", seminarConductedSchema);
module.exports = SeminarConducted;
