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

// Awards and Honors Schema
const awardsHonorsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    awardingBody: { type: String, required: true },
    year: { type: Date, required: true },
    description: { type: String, required: true },
    awardsHonorsProof: { type: String, required: true },
});

// Major and Minor Project 
const transactionDetails = new mongoose.Schema({
    purchaseOrderNumber: { type: String, required: true },
    purchaseOrderDate: { type: Date, required: true },
    purchaseInvoiceNumber: { type: String, required: true },
    purchaseInvoiceDate: { type: Date, required: true },
    bankName: { type: String, required: true },
    branchName: { type: String, required: true },
    amountRecieved: { type: Number, required: true },
    remarks: { type: String, required: true },
});

const majorminorSchema = new mongoose.Schema({
    projectTitle: { type: String, required: true },
    principalInvestigator: { type: String, required: true },
    coInvestigators: { type: [String], required: true },
    facultiesInvolved: { type: [String], required: true },
    departmentInvolved: { type: [String], required: true },
    fundingScheme: { type: String, required: true },
    fundingAgency: { type: String, required: true },
    nationalInternational: { type: String, required: true },
    budgetAmount: { type: Number, required: true },
    sanctionedAmount: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalGrantRecieved: { type: Number, required: true },
    domain: { type: String, required: true },
    areaOfExpertise: { type: String, required: true },
    description: { type: String, required: true },
    transactionDetails: { type: [transactionDetails], required: false },
    sanctionedOrder: { type: String, required: true },
    transactionProof: { type: String, required: true },
    completionCertificate: { type: String, required: true },
    supportingDocuments: { type: String, required: true },
});

// Need Based Schema


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
        type: [majorminorSchema],
        required: false
    },

    awardsHonors: {
        type: [awardsHonorsSchema],
        required: false
    },

    needBasedProjects: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'needBasedProject' }],
        required: false
    }


}, { timestamps: true }
)

facultySchema.pre('save', function (next) {
    if (this.isNew) {
        this.tags.push('incomplete profile');
    }
    next();
});

module.exports = mongoose.model('faculty', facultySchema)