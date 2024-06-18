const mongoose = require("mongoose");

// Define Mongoose schema for Journal entry with GridFS file references
const awardHonorsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    awardingBody: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      requred: true,
    },

    proof: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("awardHonor", awardHonorsSchema);
