const asyncHandler = require('express-async-handler');
const Faculty = require('../models/faculty')
const Notification = require('../models/notification')
const fs = require('fs');
const nodemailer = require('nodemailer')

const baseUrl = 'http://localhost:5000';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_KEY
    }
});

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

const createNotification = asyncHandler(async (req, res) => {

    const { title, description, imageUrl, referenceUrl, department } = req.body

    const notification = await Notification.create({
        title: title,
        description: description,
        imageUrl: imageUrl,
        referenceUrl: referenceUrl,
        department: department
    })

    if (!notification) {
        //Error
        res.status(500)
        throw new Error('Internal Server Error')
    }

    res.status(200).json({
        status: 'Success'
    })

})

/**
 * GET NOTIFICATIONS
 */

const getNotifications = asyncHandler(async (req, res) => {

    const { email } = req.headers

    const user = await Faculty.findOne({ email: email })

    if (!user) {
        //Error
        res.status(401)
        throw new Error('User not found')
    }

    const department = user.department

    const notification = await Notification.find({ department: department })

    res.status(200).json(notification)

})

/**
 * GET FACULTIES LIST
 */
const getFacultiesList = asyncHandler(async (req, res) => {

    const { email } = req.headers

    const user = await Faculty.findOne({ email: email })


    if (!user) {
        //Error
        res.status(401)
        throw new Error('User not found')
    }

    const department = user.department

    const faculties = await Faculty.find({ department: department })
        .select('profileImage email department tags')
        .exec();

    // formatting data

    const formattedFaculties = faculties.map((faculty) => {

        const formattedFaculty = faculty.toObject(); // convert to plain js object

        if (formattedFaculty.tags.includes('inactive')) {

            formattedFaculty.verified = false;
        }
        else {

            formattedFaculty.verified = true;
        }

        return formattedFaculty;
    });

    res.status(200).json(formattedFaculties);
})


/**
 * TOGGLE APPROVAL
 */

const toggleFacultyApproval = asyncHandler( async(req,res)=>{

    const { isCoordinator, email } = req.body

    const user = await Faculty.findOne({email: email})
    let message


    if(!user){
        //Error
        res.status(400)
        throw new Error('User not found')
    }

    const verified = user.tags.includes('active')

    if (verified) {
        // If user is currently verified, remove 'active' and add 'inactive'
        const index = user.tags.indexOf('active')
        user.tags.set(index,'inactive')

        message = 'Your account has been deactivated by your Department Head. Please contact your department head in case of any queries. We are sad to see you leave. Rest assured your data is safe with us. '

    } else {
        // If user is currently not verified, remove 'inactive' and add 'active'
        const index = user.tags.indexOf('inactive')
        user.tags.set(index,'active')

        message = '<strong> Congratulations ! </strong> You are now approved by your department Head for using the FPMS software. Login with your credentials and get ready for exciting journey ahead.<br /> Best regards <br /> <strong> TEAM FPMS </strong>'

        if(isCoordinator){
            user.tags.push('research coordinator')

            message = '<strong> Congratulations ! </strong> You are now approved by your department Head for using the FPMS software and have been appointed as <strong> Research and Development Coordinator </strong> . Login with your credentials and get ready for exciting journey ahead.<br /> Best regards <br /> <strong> TEAM FPMS </strong>'
        }

    }

    await user.save()

    const mailOptions = {

        from: '"FPMS SERVER 💀" <phantomcoder325@gmail.com>',
        to: email,
        subject: "ACCOUNT CREDENTIALS",
        html: `
                    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                     <div style="background-color: #ef4444; color: #fff; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 4px;">
                         🚀 ACCOUNT UPDATE : FPMS
                    </div>
                    <div style="margin-top: 20px;">
                         <p> ${message} <p>
                    </div>
                    <div style="margin-top: 20px; text-align: center; color: #888;">
                        &copy; FPMS. All rights reserved. ${new Date().getFullYear()}
                    </div>
                    </div>
    
            `,
    }


    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            res.status(500)
            throw new Error('Internal Server Error in mailer!')
        }
    });


    res.status(200).json({
        status:'Success',
    })
})

module.exports = {
    profileImageUpdate,
    createNotification,
    getNotifications,
    getFacultiesList,
    toggleFacultyApproval,
}