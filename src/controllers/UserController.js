const UserService = require('../services/UserService');

const createUser = async (req, res) => {
    try {
        console.log(req.body);
        const { name, email, password, confirmpassword, phone } = req.body;

        // Kiểm tra định dạng email
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = reg.test(email);

        // Kiểm tra các trường dữ liệu
        if (!name || !email || !password || !confirmpassword || !phone) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input required'
            });
        } else if (!isCheckEmail) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is not a valid email'
            });
        } else if (password !== confirmpassword) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The password is not equal to confirmpassword'
            });
        }

        console.log('isCheckEmail', isCheckEmail);

        // Gọi hàm createUser từ UserService và truyền req.body
        const result = await UserService.createUser(req.body);

        return res.status(200).json(result); // Trả về kết quả tạo user
    } catch (e) {
        return res.status(500).json({
            message: e.message // Chỉ trả về thông điệp lỗi
        });
    }
};

const loginUser = async (req, res) => {
    try {
        console.log(req.body);
        const { email, password } = req.body; // Chỉ cần email và password

        // Kiểm tra định dạng email
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = reg.test(email);

        // Kiểm tra các trường dữ liệu
        if (!email || !password) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Email and password are required'
            });
        } else if (!isCheckEmail) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is not a valid email'
            });
        }

        console.log('isCheckEmail', isCheckEmail);

        // Gọi hàm loginUser từ UserService và truyền req.body
        const result = await UserService.loginUser(req.body);

        return res.status(200).json(result); // Trả về kết quả đăng nhập
    } catch (e) {
        return res.status(500).json({
            message: e.message // Chỉ trả về thông điệp lỗi
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body
        if (!userId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'userId is required'
            });
        }
        console.log('userId', userId)
        // Gọi hàm loginUser từ UserService và truyền req.body
        const result = await UserService.updateUser(userId, data);

        return res.status(200).json(result); // Trả về kết quả đăng nhập
    } catch (e) {
        return res.status(500).json({
            message: e.message // Chỉ trả về thông điệp lỗi
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        const token = req.headers;
        if (!userId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'userId is required'
            });
        }
        console.log('userId', userId)
        // Gọi hàm loginUser từ UserService và truyền req.body
        const result = await UserService.deleteUser(userId);

        return res.status(200).json(result); // Trả về kết quả đăng nhập
    } catch (e) {
        return res.status(500).json({
            message: e.message // Chỉ trả về thông điệp lỗi
        });
    }
};

const getAllUser = async (req, res) => {
    try {
        const result = await UserService.getAllUser();

        return res.status(200).json(result); // Trả về kết quả đăng nhập
    } catch (e) {
        return res.status(500).json({
            message: e.message // Chỉ trả về thông điệp lỗi
        });
    }
};

const getDetailUser = async (req, res) => {
    try {
        const userId = req.params.id
        const token = req.headers;
        if (!userId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'userId is required'
            });
        }
        console.log('userId', userId)
        // Gọi hàm loginUser từ UserService và truyền req.body
        const result = await UserService.getDetailUser(userId);

        return res.status(200).json(result); // Trả về kết quả đăng nhập
    } catch (e) {
        return res.status(500).json({
            message: e.message // Chỉ trả về thông điệp lỗi
        });
    }
};

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailUser
};
