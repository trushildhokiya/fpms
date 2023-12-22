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
const errorHandler = require('./middleware/errorHandler')
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
                url: 'https://trushildhokiya.netlify.app',
                email: 'trushil.d@somaiya.edu'
            }
        },
        servers: [{
            url: `http://localhost:${PORT}`
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

app.use('/auth', authRoutes)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))
app.use(errorHandler)

/**
 * START LISTENING AT PORT
 */


app.listen(PORT, () => {
    console.log(`Server started listening at ${PORT}`);
})