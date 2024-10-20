const User = require('../models/UserModel');
const bcrypt = require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require('./JwtService');
const { charsets } = require('mime');

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, phone } = newUser; // Chỉ lấy các trường cần thiết

        try {
            const checkUser = await User.findOne({ email: email });
            if (checkUser !== null) {
                resolve({
                    status: 'ERR',  // Chỉnh sửa ở đây
                    message: "The email is already registered"
                });
            } else {
                const hash = bcrypt.hashSync(password, 10);  // Sử dụng password từ newUser
                console.log('hash', hash);

                const createUser = await User.create({
                    name,
                    email,
                    password: hash,
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

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        // Kiểm tra xem userLogin có tồn tại không
        if (!userLogin) {
            return reject(new Error("User login data is missing."));
        }

        const { email, password } = userLogin; // Chỉ lấy các trường cần thiết

        try {
            const checkUser = await User.findOne({ email });
            if (!checkUser) {
                return resolve({
                    status: 'ERR',
                    message: "The user is not defined"
                });
            }

            const comparePassword = bcrypt.compareSync(password, checkUser.password);


            if (!comparePassword) {
                return resolve({
                    status: 'ERR', // Đổi từ 'ok' thành 'ERR'
                    message: 'The password is incorrect'
                });
            }
            const access_token = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })
            const refresh_token = await genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            console.log('access_token', access_token)
            resolve({
                status: 'Ok',
                message: 'Success',
                access_token,
                refresh_token
            });
        } catch (e) {
            reject(e);  // Nếu có lỗi, trả về lỗi
        }
    });
};

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Đảm bảo tìm theo `_id` thay vì `id`
            const checkUser = await User.findById(id);
            console.log('checkUser', checkUser);
            if (!checkUser) {
                return resolve({
                    status: 'ERR',
                    message: 'User not found'
                });
            }

            // Cập nhật người dùng nếu tìm thấy
            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

            console.log("updatedUser", updatedUser)
            resolve({
                status: 'Ok',
                message: 'User updated successfully',
                data: updatedUser
            });

            resolve({
                status: 'Ok',
                message: 'Success',
            });
        } catch (e) {
            reject(e);  // Nếu có lỗi, trả về lỗi
        }
    });
};

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra xem người dùng có tồn tại hay không
            const checkUser = await User.findById(id);
            console.log('checkUser', checkUser);
            if (!checkUser) {
                return resolve({
                    status: 'ERR',
                    message: 'User not found'
                });
            }

            // Xóa người dùng nếu tìm thấy
            const deletedUser = await User.findByIdAndDelete(id);  // Không cần data hoặc { new: true }
            console.log('deletedUser', deletedUser);

            resolve({
                status: 'Ok',
                message: 'User deleted successfully',
            });
        } catch (e) {
            reject(e);  // Nếu có lỗi, trả về lỗi
        }
    });
};

const getAllUser = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            // Lấy tất cả người dùng từ cơ sở dữ liệu
            const allUsers = await User.find();
            resolve({
                status: 'Ok',
                message: 'Successfully retrieved all users',
                data: allUsers
            });
        } catch (e) {
            reject(e);  // Nếu có lỗi, trả về lỗi
        }
    });
};

const getDetailUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra xem người dùng có tồn tại hay không
            const user = await User.findById(id);
            console.log('checkUser', user);
            if (!user) {
                return resolve({
                    status: 'ERR',
                    message: 'User not found'
                });
            }


            resolve({
                status: 'Ok',
                message: 'User successfully',
                data: user
            });
        } catch (e) {
            reject(e);  // Nếu có lỗi, trả về lỗi
        }
    });
};


module.exports = {
    createUser,
    loginUser,
    updateUser,
    getAllUser,
    deleteUser,
    getDetailUser

};
