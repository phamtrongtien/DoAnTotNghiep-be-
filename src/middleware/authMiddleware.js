const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const authMiddleware = (req, res, next) => {
    console.log('checktonken', req.headers.token)
    const token = req.headers.token.split(' ')[1]

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {

        if (err) {
            return res.status(404).json({
                message: 'The auththemtication',
                status: 'ERROR'
            })
        }
        const { payload } = user;
        if (payload.isAdmin) {
            console.log('true');
            next()
        }
        else {
            return res.status(404).json({
                message: 'The auththemtication',
                status: 'ERROR'
            })
        }

    });
}
const authUserMiddleware = (req, res, next) => {
    console.log('checktonken', req.headers.token)
    const token = req.headers.token.split(' ')[1]
    const userId = req.params.id;
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {

        if (err) {
            return res.status(404).json({
                message: 'The auththemtication',
                status: 'ERROR'
            })
        }
        const { payload } = user;
        if (payload.isAdmin || payload.id === userId) {
            console.log('true');
            next()
        }
        else {
            return res.status(404).json({
                message: 'The auththemtication',
                status: 'ERROR'
            })
        }

    });
}
module.exports = {
    authMiddleware,
    authUserMiddleware
}