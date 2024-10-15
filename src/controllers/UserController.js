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
            return res.status(400).json({ // Thay đổi status về 400 cho lỗi đầu vào
                status: 'ERR',
                message: 'The input required'
            });
        } else if (!isCheckEmail) {
            return res.status(400).json({ // Thay đổi status về 400 cho lỗi đầu vào
                status: 'ERR',
                message: 'The input is not a valid email'
            });
        } else if (password !== confirmpassword) {
            return res.status(400).json({ // Thay đổi status về 400 cho lỗi đầu vào
                status: 'ERR',
                message: 'The password is not equal to confirmpassword'
            });
        }

        console.log('isCheckEmail', isCheckEmail);

        // Gọi hàm createUser từ UserService và truyền req.body
        const result = await UserService.createUser(req.body);

        return res.status(200).json(result); // Trả về kết quả tạo user
    } catch (e) {
        return res.status(500).json({ // Thay đổi status về 500 cho lỗi server
            message: e.message // Chỉ trả về thông điệp lỗi
        });
    }
};

module.exports = {
    createUser
};
