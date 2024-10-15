const createUser = () => {
    return new Promise((resolve, reject) => {
        try {
            // Logic tạo người dùng hoặc các xử lý khác
            const user = { name: "John Doe", email: "john@example.com" }; // Ví dụ dữ liệu người dùng

            resolve(user);  // Thành công, trả về dữ liệu người dùng
        } catch (e) {
            reject(e);  // Nếu có lỗi, trả về lỗi
        }
    });
};

module.exports = {
    createUser
};
