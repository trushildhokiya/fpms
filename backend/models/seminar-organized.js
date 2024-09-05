const mongoose = require("mongoose");

// Define Mongoose schema for seminarOrganized
const seminarOrganizedSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    facultiesInvolved: {
      type: [String],
      required: true
    },

    departmentInvolved: {
      type: [String],
      required: true
    },

    type: {
      type: String,
      required: true
    },

    organizedBy: {
      type: String,
      required: true
    },

    associationWith: {
      type: String,
      required: true
    },

    venue: {
      type: String,
      required: true
    },

    mode: {
      type: String,
      required: true
    },

    fromDate: {
      type: Date,
      required: true
    },

    toDate: {
      type: Date,
      required: true
    },

    level: {
      type: String,
      required: true
    },

    facultiesCount: {
      type: Number,
      required: true
    },

    studentsCount: {
      type: Number,
      required: true
    },

    participants: {
      type: Number,
      required: true
    },

    fundingReceived: {
      type: String,
      required: true
    },

    fundingAgency: {
      type: String,
      required: true
    },

    fundingAgencyType: {
      type: String,
      required: true
    },

    sanctionedAmount: {
      type: Number,
      required: true
    },

    receivedAmount: {
      type: Number,
      required: true
    },

    remarks: {
      type: String,
      required: true
    },

    videoUrl: {
      type: String,
      required: true
    },

    utilizationCertificate: {
      type: String,
      required: true
    },

    banner: {
      type: String,
      required: true
    },

    schedule: {
      type: String,
      required: true
    },

    certificate: {
      type: String,
      required: true
    },

    supportingDocuments: {
      type: String,
      required: true
    },

    report: {
      type: String,
      required: true
    },

    photos: {
      type: String,
      required: true
    },

    fundSanctionedLetter: {
      type: String,
      required: true
    },

    invitationLetter: {
      type: String,
      required: true
    },

    speakerCertificate: {
      type: String,
      required: true
    },

    organizerCertificate: {
      type: String,
      required: true
    },

    organizerLOA: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

// Compile the schema into a model
module.exports = mongoose.model("seminarOrganized", seminarOrganizedSchema);
