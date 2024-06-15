const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({

  purchaseOrderNumber: {
    type: String,
    required: true,
  },

  purchaseOrderDate: {
    type: Date,
    required: true,
  },

  purchaseInvoiceNumber: {
    type: String,
    required: true,
  },

  purchaseInvoiceDate: {
    type: Date,
    required: true,
  },

  bankName: {
    type: String,
    required: true,
  },

  branchName: {
    type: String,
    required: true,
  },

  amountReceived: {
    type: Number,
    required: true,
  },

  remarks: {
    type: String,
  }
});

module.exports = mongoose.model('transaction', transactionSchema);
