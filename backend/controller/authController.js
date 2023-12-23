const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const Admin = require('../models/admin')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registerUsers = asyncHandler( async(req,res)=>{
    
    const { email, password, role } = req.body
    
    res.status(200).json({
        message:"New admin created successfully!"
    })

})

const loginUsers = asyncHandler( async(req,res)=>{

    const { email,role,password } = req.body

    let user

    if( role==='Admin'){

        user = await Admin.findOne({email:email})
        
        if(!user){

            res.status(400)
            throw new Error("User not found")
        }
        else{

            const validUser = await bcrypt.compare(password, user.password)

            if(!validUser){

                res.status(400)
                throw new Error('Invalid credentials')
            }
        }

    }
    else if (role==="Faculty" || role==="Head Of Department")
    {

        // TODO
    }
    else{
        
        res.status(400)
        throw new Error("Bad Request")
    }

    const payload = {
        email: user.email,
        role:user.role,
        profileImage:user.profileImage
    }

    const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1d'})

    res.status(200).json({
        token:token
    })

})

const validateUser = asyncHandler( async(req,res)=>{

    const { token } = req.headers

    try{
        
        jwt.verify(token,process.env.JWT_SECRET)
        
        res.status(200).json({
            authorized:true
        })
    }
    catch(err){
        res.status(401)
        throw new Error("Invalid token");
    }

})

module.exports={

    registerUsers,
    loginUsers,
    validateUser

}