const asyncHandler = require('express-async-handler');
const Admin = require('../models/admin');
const fs = require('fs');

const baseUrl = 'http://localhost:5000';

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

        const oldImageUrl = 'uploads'+user.profileImage.split('5000')[1];

        const newImageUrl = baseUrl + newImagePath.split('uploads\ '.trim())[1];

        user.profileImage = newImageUrl;

        await user.save();

        if (oldImageUrl && fs.existsSync(oldImageUrl)) {
            fs.unlinkSync(oldImageUrl);
        }

        res.status(200).json({
            status:'Success'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = {
    profileImageUpdate,
};
