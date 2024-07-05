const asyncHandler = require('express-async-handler');
const Faculty = require('../models/faculty')
const Patent = require('../models/patent')
const Copyright = require('../models/copyright')
const Journal = require('../models/journal')
const Conference = require('../models/conference')
const Book = require('../models/book')
const Notification = require('../models/notification')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_KEY
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

/**
 * GET PATENT DATA
 */
const getPatentData = asyncHandler(async (req, res) => {

    // get department
    const { department } = req.decodedData;
    
    // construct case insensitive regex
    const regex = new RegExp(department, 'i');
    
    // get departmental patent data
    const patentData = await Patent.find({
        departmentInvolved: {
            $elemMatch: {
                $regex: regex
            }
        }
    });
    
    res.status(200).json(patentData);
});


/**
 * GET COPYRIGHT DATA
 */
const getCopyrightData = asyncHandler(async (req, res) => {

    // get department
    const { department } = req.decodedData;
    
    // construct case insensitive regex
    const regex = new RegExp(department, 'i');
    
    // get departmental copyright data
    const copyrightData = await Copyright.find({
        departmentInvolved: {
            $elemMatch: {
                $regex: regex
            }
        }
    });
    
    res.status(200).json(copyrightData);
});


/**
 * GET JOURNAL DATA
 */
const getJournalData = asyncHandler(async (req, res) => {

    // get department
    const { department } = req.decodedData;
    
    // construct case insensitive regex
    const regex = new RegExp(department, 'i');
    
    // get departmental journal data
    const journalData = await Journal.find({
        departmentInvolved: {
            $elemMatch: {
                $regex: regex
            }
        }
    });
    
    res.status(200).json(journalData);
});

/**
 * GET CONFERENCE DATA
 */
const getConferenceData = asyncHandler(async (req, res) => {

    // get department
    const { department } = req.decodedData;
    
    // construct case insensitive regex
    const regex = new RegExp(department, 'i');
    
    // get departmental conference data
    const conferenceData = await Conference.find({
        departmentInvolved: {
            $elemMatch: {
                $regex: regex
            }
        }
    });
    
    res.status(200).json(conferenceData);
});

/**
 * GET BOOK DATA
 */
const getBookData = asyncHandler(async (req, res) => {

    // get department
    const { department } = req.decodedData;
    
    // construct case insensitive regex
    const regex = new RegExp(department, 'i');
    
    // get departmental book data
    const bookData = await Book.find({
        departmentInvolved: {
            $elemMatch: {
                $regex: regex
            }
        }
    });
    
    res.status(200).json(bookData);
});


module.exports = {
    createNotification,
    getNotifications,
    getFacultiesList,
    toggleFacultyApproval,
    getPatentData,
    getCopyrightData,
    getJournalData,
    getConferenceData,
    getBookData
}