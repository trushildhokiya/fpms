/**
 * IMPORTS
*/
const dotenv = require('dotenv').config()
const express = require('express')
const cors = require('cors')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')
const connectDB = require('./config/dbConnection')
const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')
const headRoutes = require('./routes/headRoutes')
const superRoutes = require('./routes/superRoutes')
const commonRoutes = require('./routes/commonRoutes')
const facultyRoutes = require('./routes/facultyRoutes')
const errorHandler = require('./middleware/errorHandler')
const Admin = require('./models/admin')
const bcrypt = require('bcrypt')
const SuperAdmin = require('./models/superadmin')
/**
 * CONSTANTS
 */
const PORT = process.env.PORT || 5000

/**
 * CONNECT TO DATABASE
 */

connectDB()

/**
 * CREATING EXPRESS APP
 */

const app = express()

/**
 * SWAGGER SETUP
 */

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'FPMS Backend API',
            version: '0.0.1.a',
            description: "Backend REST API for Faculty Profile Management System",
            contact: {
                name: 'Trushil Dhokiya',
                url: 'https://trushildhokiya.vercel.app',
                email: 'trushil.d@somaiya.edu',

            }
        },
        servers: [{
            url: `https://fpmsbackend.kjsieit.com`
        }]
    },

    apis: ['./routes/*.js']
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)

/**
 * MIDDLEWARE
 */

app.use(cors())
app.use(express.json())
app.use(express.static(`${__dirname}/uploads`))


app.use('/auth', authRoutes)
app.use('/admin', adminRoutes)
app.use('/head', headRoutes)
app.use('/super', superRoutes)
app.use('/common',commonRoutes)
app.use('/faculty',facultyRoutes)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))
app.use(errorHandler)


/**
 * START LISTENING AT PORT
 */


app.listen(PORT, async () => {


    /**
     * CREATE DEFAULT ADMIN
     */

    try {
        const admin = await Admin.findOne({ email: 'fpms.tech@somaiya.edu' });
        const superadmin = await SuperAdmin.findOne({ email: 'sadmin.fpms@somaiya.edu' });


        if (!admin) {
            const createdAdmin = await Admin.create({
                email: 'fpms.tech@somaiya.edu',
                password: await bcrypt.hash('Admin@123', 10),
                institute: 'K.J Somaiya Institute Of Technology',
                profileImage: 'https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1709185333/catalog/1623347763800207360/rxfo7enaxci7tw2pnntx.webp'
            });

            console.log('Admin created successfully', createdAdmin);
        } else {
            console.log('Admin already exists');
        }

        if (!superadmin) {
            const createdAdmin = await SuperAdmin.create({
                email:'sadmin.fpms@somaiya.edu',
                password: await bcrypt.hash('Sadmin@123', 10),
                profileImage: 'https://w0.peakpx.com/wallpaper/582/516/HD-wallpaper-linux-programmer-pixel-art-linux-computer-hacker-pixel-8-bit.jpg'
            })

            console.log('Super Admin created successfully', createdAdmin);
        } else {
            console.log('Super Admin already exists');
        }

    } catch (err) {
        console.error(err);
    }

    console.log(`Server started listening at ${PORT}`);
});
