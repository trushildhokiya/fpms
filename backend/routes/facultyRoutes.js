const express = require('express')
const facultyAuthenticator = require('../middleware/facultyAuthenticator')
const { getDashboardData } = require('../controller/facultyController')
const router = express.Router()

router.route('/dashboard').get(facultyAuthenticator,getDashboardData)

module.exports = router