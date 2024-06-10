const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const Admin = require('../models/admin')
const Faculty = require('../models/faculty')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer")
const SuperAdmin = require('../models/superadmin')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_KEY
    }
});

const registerUsers = asyncHandler(async (req, res) => {

    const { email, password, department } = req.body

    const user = await Faculty.findOne({ email: email })

    if (user) {
        // Error
        res.status(400)
        throw new Error('User with this email already exists')
    }

    const result = await Faculty.create({
        email: email,
        password: await bcrypt.hash(password, 10),
        department: department,
        role: 'Faculty',
    })

    if (!result) {
        //Error
        res.status(500)
        throw new Error("Internal Server Error")
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
                         <p>We believe in making things simple, yet powerful. Your account is now created successfully. Wait till you recieve approval from your Department Head to use the software . Once approved you will recieve a confirmation Email</p>
                         <p>Here are your credentials to access the faculty wonderland:</p>
                            <ul>
                                <li><strong>Email:</strong> ${email}</li>
                                 <li><strong>Password:</strong> ${password}</li>
                                 <li><strong>Role:</strong> Faculty </li>
                                 <li><strong> Department: </strong> ${department} </li>
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


})

const loginUsers = asyncHandler(async (req, res) => {

    const { email, role, password } = req.body

    let user

    if (role === 'Super Admin') {

        user = await SuperAdmin.findOne({ email: email })

        if (!user) {

            res.status(400)
            throw new Error("User not found")
        }
        else {

            const validUser = await bcrypt.compare(password, user.password)

            if (!validUser) {

                res.status(400)
                throw new Error('Invalid credentials')
            }
        }

    }
    else if (role === 'Admin') {

        user = await Admin.findOne({ email: email })

        if (!user) {

            res.status(400)
            throw new Error("User not found")
        }
        else {

            const validUser = await bcrypt.compare(password, user.password)

            if (!validUser) {

                res.status(400)
                throw new Error('Invalid credentials')
            }
        }

    }
    else if (role === "Faculty" || role === "Head Of Department") {
        user = await Faculty.findOne({ email: email, role: role })

        if (!user) {

            res.status(400)
            throw new Error("User not found")
        }
        else {

            // if (user.tags.includes('inactive')) {

            //     res.status(401)
            //     throw new Error('Account not activated')

            // }

            const validUser = await bcrypt.compare(password, user.password)

            if (!validUser) {

                res.status(400)
                throw new Error('Invalid credentials')
            }
        }
    }
    else {

        res.status(400)
        throw new Error("Bad Request")
    }

    const payload = {
        email: user.email,
        role: user.role ? user.role : role,
        profileImage: user.profileImage,
        institute: user.institute,
        department: user.department ? user.department : null,
        tags: user.tags ? user.tags : null
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' })

    res.status(200).json({
        token: token
    })

})

const validateUser = asyncHandler(async (req, res) => {

    const { token } = req.headers

    try {

        jwt.verify(token, process.env.JWT_SECRET)

        res.status(200).json({
            authorized: true
        })
    }
    catch (err) {
        res.status(401)
        throw new Error("Invalid token");
    }

})

module.exports = {

    registerUsers,
    loginUsers,
    validateUser

}