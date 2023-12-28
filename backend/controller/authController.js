const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const Admin = require('../models/admin')
const Faculty = require('../models/faculty')
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
        user = await Faculty.findOne({email:email,role:role})
        
        if(!user){

            res.status(400)
            throw new Error("User not found")
        }
        else{

            if( user.tags.includes('inactive')){

                res.status(401)
                throw new Error('Account not activated')

            }

            const validUser = await bcrypt.compare(password, user.password)

            if(!validUser){

                res.status(400)
                throw new Error('Invalid credentials')
            }
        }
    }
    else{
        
        res.status(400)
        throw new Error("Bad Request")
    }

    const payload = {
        email: user.email,
        role:user.role ? user.role : role,
        profileImage:user.profileImage,
        institute: user.institute,
        department: user.department ? user.department: null,
        tags: user.tags? user.tags : null
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