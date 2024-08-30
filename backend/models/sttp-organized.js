const mongoose = require("mongoose");

// Define Mongoose schema for bookChapter
const sttpOrganizedSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    type: {
        type: String,
        required: true,
    },

    principalInvestigator: {
        type: String,
        required: true,
    },

    coInvestigator: {
        type: String,
        required: true,
    },

    coordinator: {
        type: String,
        required: true,
    },
    
    coCoordintor: {
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

    venue: {
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

    fundingRecieved: {
        type: String,
        required: true,
    },

    fundingAgencyType: {
        type: String,
        required: true,
    },

    fundingAgency: {
        type: String,
        required: true,
    },

    sanctionedAmount: {
        type: Number,
        required: true,
    },

    recievedAmount: {
        type: Number,
        required: true,
    },

    uploadFundSanctionedLetter: {
        type: String,
        required: true,
    },

    uploadUtilizationCertificate: {
        type: String,
        required: true,
    },

    uploadBanner: {
        type: String,
        required: true,
    },

    uploadScheduleOfOrganizer: {
        type: String,
        required: true,
    },

    uploadCertificateLOA: {
        type: String,
        required: true,
    },

    uploadSupportingDocuments: {
        type: String,
        required: true,
    },

    uploadReport: {
        type: String,
        required: true,
    },

    uploadPhotos: {
        type: String,
        required: true,
    },

    videoUrl: {
        type: String,
        required: true,
    },
    
  },
  { timestamps: true }
);

// Compile the schema into a model
module.exports = mongoose.model("sttpOrganized", sttpOrganizedSchema);
