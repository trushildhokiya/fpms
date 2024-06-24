const mongoose = require("mongoose");

// Define Mongoose schema for Project
const consultancySchema = new mongoose.Schema(
  {
    projectTitle: {
      type: String,
      required: true,
    },

    principalInvestigator: {
      type: String,
      required: true,
    },

    coInvestigators: {
      type: [String],
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

    fundingAgency: {
      type: String,
      required: true,
    },

    nationalInternational: {
      type: String,
      required: true,
    },

    budgetAmount: {
      type: Number,
      required: true,
    },

    sanctionedAmount: {
      type: Number,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    totalGrantReceived: {
      type: Number,
      required: true,
    },

    domain: {
      type: String,
      required: true,
    },

    areaOfExpertise: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    transactionDetails: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
      },
    ],

    sanctionedOrder: {
      type: String,
      required: true,
    },
    transactionProof: {
      type: String,
      required: true,
    },
    completionCertificate: {
      type: String,
      required: true,
    },
    supportingDocuments: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("consultancy", consultancySchema);
