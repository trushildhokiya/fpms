const mongoose = require("mongoose");

// Define Mongoose schema for bookChapter
const seminarOrganizedSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    type: {
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

    numberOfParticipants: {
        type: Number,
        required: true,
    },

    numberOfStudentsAttended: {
        type: Number,
        required: true,
    },

    numberOfFacultiesAttended: {
        type: Number,
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

    uploadFundSanctionedLetter: {
        type: String,
        required: true,
    },

    uploadInvitationLetter: {
        type: String,
        required: true,
    },

    uploadCertificateLOAToSpeaker: {
        type: String,
        required: true,
    },

    uploadCertificateOfOrganizer: {
        type: String,
        required: true,
    },

    uploadLOAOfOrganizer: {
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
module.exports = mongoose.model("seminarOrganized", seminarOrganizedSchema);
