const express = require('express')
const facultyAuthenticator = require('../middleware/facultyAuthenticator')
const { getDashboardData, tagUpdater } = require('../controller/facultyController')
const router = express.Router()

router.route('/dashboard').get(facultyAuthenticator,getDashboardData)

router.route('/update-tags').put(facultyAuthenticator,tagUpdater)

module.exports = router