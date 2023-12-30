const express = require('express')
const headAuthenticator = require('../middleware/headAuthenticator')
const { headProfileImageUpload } = require('../middleware/fileUpload')
const { profileImageUpdate } = require('../controller/headController')
const router = express.Router()


router.route('/profile/image').put(headAuthenticator,headProfileImageUpload.single('profileImage'),profileImageUpdate)


module.exports = router