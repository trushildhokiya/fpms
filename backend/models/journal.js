const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({

  title: { type: String, required: true },

  authors: { type: [String], required: true },

  authorsAffiliation: { type: [String], required: true },

  departmentInvolved: { type: [String], required: true },

  paidUnpaid: { type: String, required: true },

  facultiesInvolved: { type: [String], required: true },

  journalType: { type: String, required: true },

  journalTitle: { type: String, required: true },

  issn: { type: String, required: true },

  impactFactor: { type: Number, required: true },

  pageFrom: { type: Number, required: true },

  pageTo: { type: Number, required: true },

  year: { type: Number, required: true },

  digitalObjectIdentifier: { type: String, required: true },

  indexing: { type: [String], required: true },

  paperUrl: { type: String, required: true },

  citationCount: { type: Number, required: true },
  
  paper: { type: mongoose.Schema.Types.ObjectId, ref: 'fs.files', required: true }, 
  certificate: { type: mongoose.Schema.Types.ObjectId, ref: 'fs.files', required: true }, 
});

// Model for Journal
module.exports = mongoose.model('journal', journalSchema);


