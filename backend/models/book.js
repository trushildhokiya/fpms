const mongoose = require("mongoose");

// Define Mongoose schema for bookChapter
const bookSchema = new mongoose.Schema(
  {
    bookTitle: {
      type: String,
      required: true,
    },

    authors: {
      type: [String],
      required: true,
    },

    authorsAffiliation: {
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

    publisherName: {
      type: String,
      required: true,
    },

    nationalInternational: {
      type: String,
      required: true,
    },

    issn: {
      type: String,
      required: true,
    },

    impactFactor: {
      type: Number,
      required: true,
    },

    dateOfPublication: {
      type: Date,
      required: true,
    },

    doi: {
      type: String,
      required: true,
    },

    intendedAudience: {
      type: String,
      required: true,
    },

    description:{
      type:String,
      required:true
    },

    indexing: {
      type: [String],
      required: true,
    },

    bookUrl: {
      type: String,
      required: true,
    },

    citationCount: Number,

    proof: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Compile the schema into a model
module.exports = mongoose.model("book", bookSchema);
