const ProductService = require('../services/ProductService');

const createProduct = async (req, res) => {
    try {
        // Lấy dữ liệu từ request body
        const { name, image, type, price, countInStock, rating, description } = req.body;

        // Kiểm tra các trường dữ liệu bắt buộc
        if (!name || !image || !type || !price || !countInStock || !rating || !description) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input fields are required'
            });
        }

        // Gọi hàm tạo sản phẩm từ ProductService
        const result = await ProductService.createProduct(req.body);

        return res.status(200).json(result); // Trả về kết quả tạo sản phẩm thành công
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message // Trả về thông điệp lỗi
        });
    }
};
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params; // Lấy id của product từ params
        const { name, image, type, price, countInStock, rating, description } = req.body; // Lấy dữ liệu từ body

        // Kiểm tra các trường dữ liệu
        if (!name || !image || !type || !price || !countInStock || !rating) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input required'
            });
        }

        // Gọi hàm updateProduct từ ProductService và truyền dữ liệu vào
        const result = await ProductService.updateProduct(id, req.body);

        return res.status(200).json(result); // Trả về kết quả sau khi update
    } catch (e) {
        return res.status(500).json({
            message: e.message // Trả về thông điệp lỗi
        });
    }
};
const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        // Gọi hàm deleteProduct từ ProductService
        const result = await ProductService.deleteProduct(productId);

        // Trả về kết quả
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            status: 'ERR',
            message: error.message
        });
    }
};
const getDetailProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        // Kiểm tra xem productId có tồn tại không
        if (!productId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'productId is required'
            });
        }

        // Gọi hàm getDetailProduct từ ProductService
        const result = await ProductService.getDetailProduct(productId);

        // Kiểm tra kết quả
        if (result.status === 'ERR') {
            return res.status(404).json(result); // Trả về lỗi không tìm thấy
        }

        return res.status(200).json(result); // Trả về thông tin sản phẩm
    } catch (e) {
        return res.status(500).json({
            message: e.message // Trả về thông điệp lỗi
        });
    }
};

const getAllDetailProduct = async (req, res) => {
    try {
        // Gọi hàm getAllDetailProduct từ ProductService
        const result = await ProductService.getAllDetailProduct();

        return res.status(200).json(result); // Trả về danh sách tất cả sản phẩm
    } catch (e) {
        return res.status(500).json({
            message: e.message // Trả về thông điệp lỗi
        });
    }
};

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getDetailProduct,
    getAllDetailProduct // Thêm API getAllDetailProduct vào export
};