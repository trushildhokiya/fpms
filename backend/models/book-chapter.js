const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define Mongoose schema for bookChapter
const bookChapterSchema = new Schema(
  {
    bookTitle: {
      type: String,
      required: true,
    },

    chapterTitle: {
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

    indexing: {
      type: [String],
      required: true,
    },

    intendedAudience: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    bookUrl: {
      type: String,
      required: true,
    },

    citationCount: {
      type: Number,
      required: true,
    },

    proof: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Compile the schema into a model
module.exports = mongoose.model("bookChapter", bookChapterSchema);
