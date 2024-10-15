const UserService = require('../services/UserService')

const createUser = async (req, res) => {
    try {
        console.log(req.body)
        const result = await UserService.createUser(); // Đổi tên biến 'res' thành 'result'
        return res.status(200).json(result) // Trả về kết quả tạo user
    }
    catch (e) {
        return res.status(404).json({
            message: e.message // Nên thêm .message để chỉ trả về thông điệp lỗi
        })
    }
}

module.exports = {
    createUser
}
