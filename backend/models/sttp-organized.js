const mongoose = require("mongoose");

// Define Mongoose schema for sttpOrganized
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

    departmentInvolved: {
      type: [String],
      required: true,
    },

    facultiesInvolved: {
      type: [String],
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
    
    coCoordinator: { 
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

    fundingReceived: { 
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

    receivedAmount: { 
      type: Number,
      required: true,
    },

    fundSanctionedLetter: {
      type: String,
      required: true,
    },

    utilizationCertificate: {
      type: String,
      required: true,
    },

    banner: {
      type: String,
      required: true,
    },

    schedule: {
      type: String,
      required: true,
    },

    certificate: {
      type: String,
      required: true,
    },

    supportingDocuments: {
      type: String,
      required: true,
    },

    report: {
      type: String,
      required: true,
    },

    photos: {
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
