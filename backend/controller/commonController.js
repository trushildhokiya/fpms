const asyncHandler = require('express-async-handler');
const Faculty = require('../models/faculty')


const addProfile = asyncHandler( async(req,res)=>{

    //get required data
    const data = req.body;
    const {email} = req.decodedData;

    // find user
    const user = await Faculty.findOne({email: email})

    if(!user){
        res.status(400)
        throw new Error("User not found!")
    }

    // save data
    user.profile = data
    await user.save()

    res.status(200).json({
        message: "success"
    })
    
})

const getProfileData = asyncHandler( async(req,res)=>{

    //get required data
    const {email} = req.decodedData;

    // find user
    const user = await Faculty.findOne({email: email})

    if(!user){
        res.status(400)
        throw new Error("User not found!")
    }

    const profileData = user.profile

    res.status(200).json(profileData)
    
})


module.exports={
    addProfile,
    getProfileData
}