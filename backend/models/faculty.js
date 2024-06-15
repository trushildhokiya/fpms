const mongoose = require('mongoose')

/**
 * SUB SCHEMAS
 */

const profileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    contact: { type: Number, required: true },
    email: { type: String, required: true },
    alternateContact: { type: Number, required: true },
    alternateEmail: { type: String, required: true }
});

const experienceSchema = new mongoose.Schema({
    experienceType: { type: String, required: true },
    organizationName: { type: String, required: true },
    organizationAddress: { type: String, required: true },
    organizationUrl: { type: String, required: true },
    designation: { type: String, required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    experienceIndustry: { type: String, required: true },
    totalExperience: { type: String, required: true },
    experienceProof: { type: String, required: true } // Assuming you store file paths or GridFS file IDs here
});

const researchSchema = new mongoose.Schema({
    name: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    contact: { type: Number, required: true },
    email: { type: String, required: true },
    googleScholarId: { type: String, required: false },
    googleScholarUrl: { type: String, required: false },
    scopusId: { type: String, required: false },
    scopusUrl: { type: String, required: false },
    orcidId: { type: String, required: false },
    hIndexGoogleScholar: { type: String, required: false },
    hIndexScopus: { type: String, required: false },
    citationCountGoogleScholar: { type: Number, required: false },
    citationCountScopus: { type: Number, required: false },
    iTenIndexGoogleScholar: { type: String, required: false },
    iTenIndexScopus: { type: String, required: false }
});


/**
 * MAIN SCHEMA
 */

const facultySchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    institute: {
        type: String,
        required: false,
        default: 'K.J Somaiya Institute Of Technology'
    },
    profileImage: {
        type: String,
        required: false,
        default: 'https://static.vecteezy.com/system/resources/previews/027/378/301/original/male-character-is-running-in-8-bit-pixel-art-human-pixels-in-illustration-for-game-assets-or-cross-stitch-pattern-vector.jpg'
    },
    role: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },

    tags: {
        type: [String],
        default: ['inactive']
    },

    profile: {
        type: profileSchema,
        required: false
    },

    experience: {
        type: [experienceSchema],
        required: false
    },

    researchProfile:{
        type:researchSchema,
        required:false,
    },

    


}, { timestamps: true }
)

facultySchema.pre('save', function (next) {
    if (this.isNew) {
        this.tags.push('incomplete profile');
    }
    next();
});

module.exports = mongoose.model('faculty', facultySchema)