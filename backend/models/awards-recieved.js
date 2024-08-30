const mongoose = require("mongoose");

// Define Mongoose schema for Awards Recieved
const AwardRecievedSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    organization: {
      type: String,
      required: true,
    },

    venue: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
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

    certificate: {
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
const AwardRecieved = mongoose.model("awardRecieved", AwardRecievedSchema);
module.exports = AwardRecieved;
