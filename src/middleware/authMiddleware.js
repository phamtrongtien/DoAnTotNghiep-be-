const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleware = (req, res, next) => {
    console.log('checktoken', req.headers.token);

    // Kiểm tra xem header token có tồn tại không
    if (!req.headers.token) {
        return res.status(401).json({
            message: 'No token provided',
            status: 'ERROR'
        });
    }

    // Tách token
    const token = req.headers.token.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(401).json({
                message: 'Authentication failed',
                status: 'ERROR'
            });
        }

        if (user.isAdmin) {
            console.log('Admin access granted');
            next();
        } else {
            return res.status(403).json({
                message: 'Access denied: You are not an admin',
                status: 'ERROR'
            });
        }
    });
};

const authUserMiddleware = (req, res, next) => {
    console.log('checktoken', req.headers.token);

    // Kiểm tra xem header token có tồn tại không
    if (!req.headers.token) {
        return res.status(401).json({
            message: 'No token provided',
            status: 'ERROR'
        });
    }

    // Tách token
    const token = req.headers.token.split(' ')[1];
    const userId = req.params.id;

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(401).json({
                message: 'Authentication failed',
                status: 'ERROR'
            });
        }

        if ((user.isAdmin || user.id === userId)) {
            console.log('User access granted');
            next();
        } else {
            return res.status(403).json({
                message: 'Access denied: You are not authorized to access this resource',
                status: 'ERROR'
            });
        }
    });
};

module.exports = {
    authMiddleware,
    authUserMiddleware
};
