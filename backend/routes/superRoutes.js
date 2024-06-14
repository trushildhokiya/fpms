const express = require('express')
const headAuthenticator = require('../middleware/headAuthenticator')
const { headProfileImageUpload } = require('../middleware/fileUpload')
const {  getFacultiesList, toggleFacultyApproval } = require('../controller/superController')
const router = express.Router()



router.route('/faculties').get( getFacultiesList )

router.route('/faculties').put( toggleFacultyApproval)


module.exports = router