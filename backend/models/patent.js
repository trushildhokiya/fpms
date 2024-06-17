const mongoose = require('mongoose');

// Define Mongoose schema for Patent
const patentSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  inventors: {
    type: [String],
    required: true
  },

  affiliationInventors: {
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

  country: {
    type: String,
    required: true
  },

  applicationNumber: {
    type: String,
    required: true
  },

  filingDate: {
    type: Date,
    required: true
  },

  grantDate: {
    type: Date,
    required: true
  },

  patentCertificate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'fs.files', // Assuming GridFS collection name
    required: true
  }
});

// Compile the schema into a model
const Patent = mongoose.model('patent', patentSchema);

module.exports = Patent;
