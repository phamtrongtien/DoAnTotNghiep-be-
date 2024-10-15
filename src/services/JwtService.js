const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


const genneralAccessToken = async (payload) => {

    const access_token = jwt.sign({
        payload
    }, process.env.ACCESS_TOKEN, { expiresIn: '1h' });
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

module.exports = {
    genneralAccessToken,
    genneralRefreshToken
};
