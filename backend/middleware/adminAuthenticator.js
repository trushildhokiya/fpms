const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { jwtDecode } = require('jwt-decode');

const adminAuthenticator = asyncHandler(async (req, res, next) => {
    const { token } = req.headers;
    try {
        const valid = jwt.verify(token, process.env.JWT_SECRET); // Replace 'your-secret-key' with the actual secret key

        if (!valid) {

            res.status(401).json();
            throw new Error('Invalid token')
        }

        const decodedData = jwtDecode(token);

        if (decodedData.role === 'Admin') {

            next();

        } else {

            res.status(403)
            throw new Error('Forbidden: Not an admin')
        }
    } catch (err) {

        res.status(500)
        throw new Error('Internal Server Error')
    }
});

module.exports = adminAuthenticator;
