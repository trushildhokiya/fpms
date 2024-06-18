const mongoose = require("mongoose");

// Define Mongoose schema for Copyright
const copyrightSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    inventors: {
      type: [String],
      required: true,
    },

    affiliationInventors: {
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

    nationalInternational: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    applicationNumber: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    copyrightCertificate: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Compile the schema into a model

module.exports = mongoose.model("copyright", copyrightSchema);
