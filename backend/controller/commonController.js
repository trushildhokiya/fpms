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


const addExperience = async (req, res) => {

    //get required data
    const {email} = req.decodedData;

    // find user
    const user = await Faculty.findOne({email: email})

    if(!user){
        res.status(400)
        throw new Error("User not found!")
    }

    // add xperience json in array
    for( let i=0 ; i<req.body.experienceDetails.length ; i++){

        const data = req.body.experienceDetails[i]
        data.experienceProof = req.files[i].path

        user.experience.push(data)
    }

    await user.save()

    res.status(200).json({
        message:"success"
    })
};

const getExperienceData = asyncHandler(async (req, res) => {
    const { email } = req.decodedData;

    // Find user
    const user = await Faculty.findOne({ email: email });

    if (!user) {
        res.status(400);
        throw new Error("User not found!");
    }

    const experienceData = user.experience;

    let industryExperienceMonths = 0;
    let teachingExperienceMonths = 0;

    experienceData.forEach(exp => {

        // convert to Date
        const fromDate = new Date(exp.fromDate);
        const toDate = new Date(exp.toDate);

        //cqalculate total months
        let months = (toDate.getFullYear() - fromDate.getFullYear()) * 12;
        months += toDate.getMonth() - fromDate.getMonth();

        // handle partial months
        if (toDate.getDate() >= fromDate.getDate()) {
            months += 1;
        }

        // segregate data
        if (exp.experienceIndustry.toLowerCase() === 'industry') {
            industryExperienceMonths += months;
        } else if (exp.experienceIndustry.toLowerCase() === 'teaching') {
            teachingExperienceMonths += months;
        }

    });

    const totalExperienceMonths = industryExperienceMonths + teachingExperienceMonths;

    const formatExperience = (months) => {
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        return `${years} years and ${remainingMonths} months`;
    };

    res.status(200).json({
        experience: experienceData,
        industryExperience: formatExperience(industryExperienceMonths),
        teachingExperience: formatExperience(teachingExperienceMonths),
        totalExperience: formatExperience(totalExperienceMonths),
    });
    
});



const addResearchProfile = asyncHandler( async(req,res)=>{

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
    user.researchProfile = data
    await user.save()

    res.status(200).json({
        message: "success"
    })
    
})

const getResearchProfileData = asyncHandler( async(req,res)=>{

    //get required data
    const {email} = req.decodedData;

    // find user
    const user = await Faculty.findOne({email: email})

    if(!user){
        res.status(400)
        throw new Error("User not found!")
    }

    const researchProfileData = user.researchProfile

    res.status(200).json(researchProfileData)
    
})

module.exports={
    addProfile,
    getProfileData,
    addExperience,
    getExperienceData,
    addResearchProfile,
    getResearchProfileData
}