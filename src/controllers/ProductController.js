const ProductService = require('../services/ProductService');

const createProduct = async (req, res) => {
    try {
        // Lấy dữ liệu từ request body
        const { name, image, type, price, countInStock, rating, description, selled, discount } = req.body;

        // Kiểm tra các trường dữ liệu bắt buộc
        if (!name) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input fields are required ở đây'
            });
        }

        // Kiểm tra dữ liệu bổ sung (tính hợp lệ)
        if (price < 0) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Price must be a positive number'
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Rating must be between 1 and 5'
            });
        }

        // Kiểm tra nếu sản phẩm đã tồn tại với tên này


        // Gọi hàm tạo sản phẩm từ ProductService
        const result = await ProductService.createProduct(req.body);

        return res.status(201).json(result); // Trả về kết quả tạo sản phẩm thành công
    } catch (e) {
        console.error('Error creating product:', e);  // Log lỗi để dễ dàng debug
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal Server Error' // Trả về thông điệp lỗi
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params; // Lấy id của product từ params
        const { name, image, type, price, countInStock, rating, description, discount, selled } = req.body; // Lấy dữ liệu từ body

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
        const { limit, page, sort, filter } = req.query;

        // Chuyển limit thành undefined nếu không được cung cấp
        const result = await ProductService.getAllDetailProduct(
            limit ? Number(limit) : undefined, // Không giới hạn nếu limit không tồn tại
            Number(page) || 0,
            sort,
            filter
        );

        return res.status(200).json(result); // Trả về danh sách sản phẩm
    } catch (e) {
        return res.status(500).json({
            message: e.message // Trả về thông điệp lỗi
        });
    }
};


// const getAllDetailProduct = async (req, res) => {
//     try {
//         const { limit, page, sort, filter } = req.query
//         // Gọi hàm getAllDetailProduct từ ProductService
//         const result = await ProductService.getAllDetailProduct(Number(limit) || 8, Number(page) || 0, sort, filter);

//         return res.status(200).json(result); // Trả về danh sách tất cả sản phẩm
//     } catch (e) {
//         return res.status(500).json({
//             message: e.message // Trả về thông điệp lỗi
//         });
//     }
// };
const getAllTypeProduct = async (req, res) => {
    try {

        const result = await ProductService.getAllTypeProduct();

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
    getAllDetailProduct,
    getAllTypeProduct// Thêm API getAllDetailProduct vào export
};