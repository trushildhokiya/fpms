const mongoose = require('mongoose');


const conferenceSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
  },

  authors: {
    type: [String],
    required: true
  },

  authorsAffiliation: {
    type: [String],
    required: true
  },

  departmentInvolved: {
    type: [String],
    required: true
  },
  
  facultiesInvolved: {
    type: [String],
    required: true
  },

  nationalInternational: {
    type: String,
    required: true
  },

  conferenceName: {
    type: String,
  },

  venue: {
    type: String,
  },

  organizer: {
    type: String,
  },

  role: {
    type: String,
  },

  fromDate: {
    type: Date,
  },

  toDate: {
    type: Date,
  },

  paperStatus: {
    type: String,
  },

  publicationDate: {
    type: Date,
  },

  issn: {
    type: String,
  },

  impactFactor: {
    type: Number,
  },
  
  pageNo: {
    type: String,
  },

  yearOfPublication: {
    type: Number,
  },

  doi: {
    type: String,
  },

  indexing: {
    type: [String]
  },

  paperUrl: {
    type: String,
  },

  citationCount: {
    type: Number,
  },

  paper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'fs.files', // Assuming GridFS collection name
  },

  certificate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'fs.files', // Assuming GridFS collection name
  }
  
});

module.exports = mongoose.model('conference', conferenceSchema);
