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
    experienceProof: { type: String, required: true } 
});

const researchSchema = new mongoose.Schema({
    name: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    contact: { type: Number, required: true },
    email: { type: String, required: true },
    googleScholarId: { type: String, required: true },
    googleScholarUrl: { type: String, required: true },
    scopusId: { type: String, required: true },
    scopusUrl: { type: String, required: true },
    orcidId: { type: String, required: true },
    hIndexGoogleScholar: { type: String, required: true },
    hIndexScopus: { type: String, required: true },
    citationCountGoogleScholar: { type: Number, required: true },
    citationCountScopus: { type: Number, required: true },
    iTenIndexGoogleScholar: { type: String, required: true },
    iTenIndexScopus: { type: String, required: true }
});

const qualificationSchema = new mongoose.Schema({
    degree: { type: String, required: true },
    stream: { type: String, required: true },
    institute: { type: String, required: true },
    university: { type: String, required: true },
    year: { type: Number, required: true },
    class: { type: String, required: true },
    status: { type: String, required: true },
    proof: { type: String, required: true },
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

    researchProfile: {
        type: researchSchema,
        required: false,
    },

    qualification:{
        type: [qualificationSchema],
        required: false,
    },

    journal: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'journal' }],
        required: false
    },

    conference: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'conference' }],
        required: false
    },

    book: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'book' }],
        required: false
    },

    bookChapter: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'bookChapter' }],
        required: false
    },

    patent: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'patent' }],
        required: false
    },

    copyright: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'copyright' }],
        required: false
    },

    consultancy: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'consultancy' }],
        required: false
    },

    projects: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'project' }],
        required: false
    },

    awardsHonors: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'awardHonor' }],
        required: false
    },

    needBasedProjects: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'needBasedProject' }],
        required: false
    },

    activityConducted: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'activityConducted' }],
        required: false
    },

    awardRecieved: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'awardRecieved' }],
        required: false
    },

    courseCertification: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'courseCertification' }],
        required: false
    },

    sttpConducted: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'sttpConducted' }],
        required: false
    },

    sttpAttended: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'sttpAttended' }],
        required: false
    },

    sttpOrganized: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'sttpOrganized' }],
        required: false
    },

    seminarConducted: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'seminarConducted' }],
        required: false
    },

    seminarAttended: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'seminarAttended' }],
        required: false
    },

    seminarOrganized: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'seminarOrganized' }],
        required: false
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