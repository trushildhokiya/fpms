const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { jwtDecode } = require('jwt-decode');

const headAuthenticator = asyncHandler(async (req, res, next) => {

    const { token } = req.headers;
    try {
        const valid = jwt.verify(token, process.env.JWT_SECRET); // Replace 'your-secret-key' with the actual secret key

        if (!valid) {

            res.status(401).json();
            throw new Error('Invalid token')
        }

        const decodedData = jwtDecode(token);


        if (decodedData.role === 'Head Of Department' || decodedData.tags.includes('research coordinator') ) {

            next();

        } 
        else {

            res.status(403)
            throw new Error('Forbidden: Not an Head Of Department')
        }

    } catch (err) {

        res.status(res.statusCode ? res.statusCode :500)
        throw new Error(err.message? err.message :'Internal Server Error')
    }
});

module.exports = headAuthenticator;
