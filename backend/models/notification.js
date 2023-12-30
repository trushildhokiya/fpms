const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:false,
        default:'https://picsum.photos/1080/720'
    },
    referenceUrl:{
        type:String,
        required:false,
    },
    department:{
        type:String,
        required: true
    }
}, { timestamps: true }
)

module.exports = mongoose.model('notification',notificationSchema)