const asyncHandler = require('express-async-handler');
const Faculty = require('../models/faculty')
const Notification = require('../models/notification')
const fs = require('fs');

const baseUrl = 'http://localhost:5000';



/**
 * UPDATE PROFILE IMAGE
 */
const profileImageUpdate = asyncHandler(async (req, res) => {
    const { email } = req.headers;
    const newImagePath = req.file.path;

    try {
        // Find the head by email
        const user = await Faculty.findOne({ email });

        // If the admin is not found, return an error
        if (!user) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        const oldImageUrl = 'uploads' + user.profileImage.split('5000')[1];

        const newImageUrl = baseUrl + newImagePath.split('uploads\ '.trim())[1];

        user.profileImage = newImageUrl;

        await user.save();

        if (oldImageUrl && fs.existsSync(oldImageUrl)) {
            fs.unlinkSync(oldImageUrl);
        }

        res.status(200).json({
            status: 'Success'
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * CREATE NOTIFICATION 
 */

const createNotification = asyncHandler( async(req,res)=>{

    const { title,description, imageUrl, referenceUrl, department } = req.body

    const notification = await Notification.create({
        title:title,
        description: description,
        imageUrl: imageUrl,
        referenceUrl: referenceUrl,
        department: department
    })

    if( !notification){
        //Error
        res.status(500)
        throw new Error('Internal Server Error')
    }

    res.status(200).json({
        status:'Success'
    })

})

module.exports={
    profileImageUpdate,
    createNotification,
}