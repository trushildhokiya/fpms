const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')

const connectdb = asyncHandler( async ()=>{
    try{
        
        const connect = await mongoose.connect(process.env.CONNECTION_STRING)
        console.log('Connected to database: ', connect.connection.host )
    }
    catch (err) {

        console.log(err)

    }
})


module.exports = connectdb