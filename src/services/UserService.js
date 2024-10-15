const User = require('../models/UserModel');

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, phone } = newUser; // Chỉ lấy các trường cần thiết

        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser !== null) {
                resolve({
                    status: 'oke',
                    message: "the email is already"
                })
            } else {
                const createUser = await User.create({
                    name,
                    email,
                    password,
                    phone // Không cần confirmpassword
                });

                if (createUser) {
                    resolve({
                        status: 'Ok',
                        message: 'Success',
                        data: createUser
                    });
                }
            }

        } catch (e) {
            reject(e);  // Nếu có lỗi, trả về lỗi
        }
    });
};

module.exports = {
    createUser
};
