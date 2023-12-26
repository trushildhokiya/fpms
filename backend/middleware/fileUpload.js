const multer = require('multer');
const fs = require('fs');
const path = require('path');

const ensureDirectoryExists = async (directory) => {
    try {
        await fs.promises.mkdir(directory, { recursive: true });
    } catch (error) {
        console.error('Error creating directory:', error);
    }
};

const adminProfileImageStorage = multer.diskStorage({
    destination: async function (req, file, cb) {
        const destinationPath = path.join('uploads', 'profileImage', 'admin');

        await ensureDirectoryExists(destinationPath);

        cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix+path.extname(file.originalname));
    }
});

const adminProfileImageUpload = multer({ storage: adminProfileImageStorage });


module.exports={
    adminProfileImageUpload
}