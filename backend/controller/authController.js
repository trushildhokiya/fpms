const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const Admin = require('../models/admin')

const registerUsers = asyncHandler( async(req,res)=>{
    
    const { email, password, role } = req.body
    
    res.status(200).json({
        message:"New admin created successfully!"
    })

})


module.exports={

    registerUsers

}