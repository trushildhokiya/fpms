const asyncHandler = require('express-async-handler');
const Admin = require('../models/admin');
const Faculty = require('../models/faculty')
const Patent = require('../models/patent')
const Journal = require('../models/journal')
const Conference = require('../models/conference')
const Copyright = require('../models/copyright')
const AwardHonors = require('../models/award-honors')
const NeedBasedProjects = require('../models/need-based-projects')
const BookChapter = require('../models/book-chapter')
const Book = require('../models/book')
const Projects = require('../models/projects')
const fs = require('fs');
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_KEY
    }
});

const baseUrl = 'http://localhost:5000';




/**
 * UPDATE PROFILE IMAGE
 */
const profileImageUpdate = asyncHandler(async (req, res) => {
    const { email } = req.headers;
    const newImagePath = req.file.path;

    try {
        // Find the admin by email
        const user = await Admin.findOne({ email });

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
 * REGISTER USERS
 */
const registerUsers = asyncHandler(async (req, res) => {

    const { email, role, password, department } = req.body
    console.log(email, role, password);

    const userAdmin = await Admin.findOne({ email })
    const userFaculty = await Faculty.findOne({ email })

    if (!userAdmin && !userFaculty) {

        if (role === 'Admin') {

            const result = await Admin.create({
                email: email,
                password: await bcrypt.hash(password, 10),
                profileImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGBu2FMepxzOa0KZBisB0uUrvDEiU-g1Hl2g&usqp=CAU'
            })

            if (!result) {
                // error
                res.status(500)
                throw new Error('Internal Server Error')
            }

        }
        else if (role === 'Head Of Department') {

            const result = await Faculty.create({
                email: email,
                password: await bcrypt.hash(password, 10),
                role: role,
                department: department,
                tags: ['active'],
                profileImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGBu2FMepxzOa0KZBisB0uUrvDEiU-g1Hl2g&usqp=CAU'
            })

            if (!result) {
                // error
                res.status(500)
                throw new Error('Internal Server Error')
            }

        }

        const mailOptions = {

            from: '"FPMS SERVER 💀" <phantomcoder325@gmail.com>',
            to: email,
            subject: "ACCOUNT CREDENTIALS",
            html: `
                        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                         <div style="background-color: #ef4444; color: #fff; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 4px;">
                             🚀 Welcome to FPMS - Your Faculty Hub!
                        </div>
                        <div style="margin-top: 20px;">
                             <p>Congratulations on joining FPMS, your go-to platform for managing faculty profiles with ease and efficiency!</p>
                             <p>We believe in making things simple, yet powerful. Your account is now live, and you're just a login away from unlocking a world of possibilities.</p>
                             <p>Here are your credentials to access the faculty wonderland:</p>
                                <ul>
                                    <li><strong>Email:</strong> ${email}</li>
                                     <li><strong>Password:</strong> ${password}</li>
                                     <li><strong>Role:</strong> ${role}</li>
                                </ul>
                                <p>Ready to embark on this journey? Log in now and discover a seamless experience in managing faculty profiles like never before!</p>
                                <p>Should you encounter any enchanted challenges along the way, our support wizards are here to assist. Feel free to reach out whenever you need a sprinkle of magic!</p>
                                <p>Thank you for choosing FPMS - where faculty management meets magic! 🌟</p>
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
            status: 'Success'
        })

    }

    res.status(400)
    throw new Error('User already exists')


})




/**
 * GET FACULTY LIST
 */
const facultyList = asyncHandler(async (req, res) => {

    const data = await Faculty.find({ role: 'Faculty' })
    res.status(200).json(data)

})

/**
 * GET HEAD LIST
 */
const headList = asyncHandler(async (req, res) => {
    const data = await Faculty.find({ role: 'Head Of Department' })
    res.status(200).json(data)
})


/**
 * GET ADMIN LIST
 */
const adminList = asyncHandler(async (req, res) => {
    const data = await Admin.find()
    res.status(200).json(data)

})

/**
 * GET PATENT DATA
 */
const getPatentData = asyncHandler(async(req,res)=>{

    const patentData = await Patent.find()
    res.status(200).json(patentData)
})

/**
 * GET COPYRIGHT DATA
 */
const getCopyrightData = asyncHandler(async(req,res)=>{

    const copyrightData = await Copyright.find()
    res.status(200).json(copyrightData)
})

/**
 * GET JOURNAL DATA
 */
const getJournalData = asyncHandler(async(req,res)=>{

    const journalData = await Journal.find()
    res.status(200).json(journalData)
})


/**
 * GET CONFERENCE DATA
 */
const getConferenceData = asyncHandler(async(req,res)=>{

    const conferenceData = await Conference.find()
    res.status(200).json(conferenceData)
})


/**
 * GET BOOK DATA
 */
const getBookData = asyncHandler(async(req,res)=>{

    const bookData = await Book.find()
    res.status(200).json(bookData)
})

/**
 * GET BOOK CHAPTER DATA
 */
const getBookChapterData = asyncHandler(async(req,res)=>{

    const bookChapterData = await BookChapter.find()
    res.status(200).json(bookChapterData)
})

/**
 * GET NEED BASED PROJECT DATA
 */
const getNeedBasedProjectsData = asyncHandler(async(req,res)=>{

    const needBasedProjectsData = await NeedBasedProjects.find()
    res.status(200).json(needBasedProjectsData)
})


/**
 * GET AWARDS HONORS DATA
 */
const getAwardsHonorsData = asyncHandler(async(req,res)=>{

    const awardsHonorsData = await AwardHonors.find()
    res.status(200).json(awardsHonorsData)
})

/**
 * GET MAJOR MINOR PROJECTS DATA
 */
const getProjectsData = asyncHandler(async(req,res)=>{

    const projectsData = await Projects.find().populate('transactionDetails')
    res.status(200).json(projectsData)
    
})


module.exports = {
    profileImageUpdate,
    registerUsers,
    facultyList,
    headList,
    adminList,
    getPatentData,
    getCopyrightData,
    getJournalData,
    getConferenceData,
    getBookData,
    getBookChapterData,
    getNeedBasedProjectsData,
    getAwardsHonorsData,
    getProjectsData,
};
