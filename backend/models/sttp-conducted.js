const mongoose = require("mongoose");

// Define Mongoose schema for bookChapter
const sttpConductedSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    sessionTitle: {
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

    totalDays: {
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
    
    invitationUpload: {
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
// module.exports = mongoose.model("sttpConducted", sttpConductedSchema);
const SttpConducted = mongoose.model("sttpConducted", sttpConductedSchema);
module.exports = SttpConducted;
