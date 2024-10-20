const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


const genneralAccessToken = async (payload) => {

    const access_token = jwt.sign({
        payload
    }, process.env.ACCESS_TOKEN, { expiresIn: '30s' });
    return access_token;
};

const genneralRefreshToken = async (payload) => {
    console.log(process.env.ACCESS_TOKEN);
    console.log(process.env.REFRESH_TOKEN);

    const refresh_token = jwt.sign({
        payload
    }, process.env.REFRESH_TOKEN, { expiresIn: '365d' });
    return refresh_token;
};

const refreshTokenJwtService = (token) => {
    return new Promise((resolve, reject) => {
        try {
            // Xác minh token
            jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
                if (err) {
                    return resolve({
                        status: 'ERR',
                        message: 'Authentication failed or token expired'
                    });
                }

                // Nếu không có lỗi, tạo access_token mới từ thông tin user
                const access_token = await genneralAccessToken({
                    id: user.id,
                    isAdmin: user.isAdmin
                });

                console.log('access_token:', access_token);
                resolve({
                    status: 'OK',
                    message: 'Token refreshed successfully',
                    access_token
                });
            });
        } catch (e) {
            reject({
                status: 'ERR',
                message: 'An error occurred while refreshing token',
                error: e
            });
        }
    });
};

module.exports = {
    refreshTokenJwtService
};


module.exports = {
    genneralAccessToken,
    genneralRefreshToken,
    refreshTokenJwtService
};
