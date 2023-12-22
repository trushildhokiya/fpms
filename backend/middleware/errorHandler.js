const { constants } = require('../constants')

const errorHandler = (err, req, res, next) => {

    const statusCode = res.statusCode ? res.statusCode : 500

    switch (statusCode) {

        case constants.BAD_REQUEST:
            res.json({
                title: 'BAD REQUEST',
                message: err.message,
                stackTrace: err.stack
            })

        case constants.UNAUTHORIZED:
            res.json({
                title: 'Unauthorized',
                message: err.message,
                stackTrace: err.stack
            })

        case constants.PAYMENT_REQUIRED:
            res.json({
                title: 'Payment Required',
                message: err.message,
                stackTrace: err.stack
            })

        case constants.FORBIDDEN:
            res.json({
                title: 'FORBIDDEN REQUEST',
                message: err.message,
                stackTrace: err.stack
            })

        case constants.NOT_FOUND:
            res.json({
                title: 'NOT FOUND',
                message: err.message,
                stackTrace: err.stack
            })

        case constants.METHOD_NOT_ALLOWED:
            res.json({
                title: 'Method not allowed',
                message: err.message,
                stackTrace: err.stack
            })

        case constants.INTERNAL_SERVER_ERROR:
            res.json({
                title: 'Internal Server ERROR',
                message: err.message,
                stackTrace: err.stack
            })

        default:
            break

    }
}


module.exports = errorHandler