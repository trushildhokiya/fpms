const mongoose = require('mongoose');

// Define Mongoose schema for Journal entry with GridFS file references
const awardHonorsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    awardingBody: {
        type: String,
        required: true
    },

    year: {
        type: Number,
        required: true
    },

    description: {
        type: String,
        requred: true
    },
    
    proof: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'fs.files', // Reference to GridFS files collection
        required: true
    }
});

// Compile the schema into a model
const AwardHonor = mongoose.model('awardHonor', awardHonorsSchema);

module.exports = AwardHonor;
