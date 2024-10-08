const mongoose = require("mongoose");

// Define Mongoose schema for Activity Conducted
const ActivityConductedSchema = new mongoose.Schema(
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

    departmentInvolved: {
      type: [String],
      required: true,
    },

    facultiesInvolved: {
      type: [String],
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

    participants: {
      type: Number,
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
    
    venue: {
      type: String,
      required: true,
    },

    remarks: {
      type: String,
      required: true,
    },

    invitationLetter: {
      type: String,
      required: false,
    },

    certificate: {
      type: String,
      required: true,
    },

    banner: {
      type: String,
      required: false,
    },

    report: {
      type: String,
      required: false,
    },

    photos: {
      type: String,
      required: false,
    },

    videoLink: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Compile the schema into a model
const ActivityConducted = mongoose.model("activityConducted", ActivityConductedSchema);
module.exports = ActivityConducted;

