const mongoose = require('mongoose')

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
}, { timestamps: true }
)

module.exports = mongoose.model('faculty', facultySchema)