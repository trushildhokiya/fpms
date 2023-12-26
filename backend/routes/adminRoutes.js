const express = require('express')
const { adminProfileImageUpload } = require('../middleware/fileUpload')
const { profileImageUpdate } = require('../controller/adminController')
const adminAuthenticator = require('../middleware/adminAuthenticator')
const router = express.Router()

router.route('/profile/image').put(adminAuthenticator,adminProfileImageUpload.single('profileImage'),profileImageUpdate)

module.exports= router