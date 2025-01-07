const Product = require('../models/ProductModel');

const createProduct = async (newProduct) => {
    const { name, image, type, price, countInStock, rating, description, selled, discount } = newProduct;

    try {
        // Kiểm tra xem sản phẩm có tồn tại không
        const checkProduct = await Product.findOne({ name });

        if (checkProduct) {
            return {
                status: 'ERR',
                message: "The product name is already registered"
            };
        }

        // Kiểm tra giá trị của price và rating
        if (price < 0) {
            return {
                status: 'ERR',
                message: "Price must be a positive number"
            };
        }

        if (rating < 1 || rating > 5) {
            return {
                status: 'ERR',
                message: "Rating must be between 1 and 5"
            };
        }

        // Tạo sản phẩm mới
        const createdProduct = new Product({
            name, image, type, price, countInStock, rating, description, selled, discount
        });

        // Lưu vào cơ sở dữ liệu
        await createdProduct.save();

        // Trả về kết quả tạo thành công
        return {
            status: 'OK',
            message: 'Product created successfully',
            data: createdProduct
        };

    } catch (e) {
        console.error('Error creating product:', e);  // Log lỗi để dễ dàng debug
        return {
            status: 'ERR',
            message: e.message || 'Internal Server Error' // Trả về thông điệp lỗi
        };
    }
};


const updateProduct = (id, updatedProduct) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Tìm product theo id
            const product = await Product.findById(id);

            // Nếu không tìm thấy product
            if (!product) {
                return resolve({
                    status: 'ERR',
                    message: 'Product not found'
                });
            }

            // Cập nhật thông tin product
            const updatedProductData = await Product.findByIdAndUpdate(
                id,
                {
                    name: updatedProduct.name,
                    image: updatedProduct.image,
                    type: updatedProduct.type,
                    price: updatedProduct.price,
                    countInStock: updatedProduct.countInStock,
                    rating: updatedProduct.rating,
                    description: updatedProduct.description,
                    discount: updatedProduct.discount,
                    selled: updatedProduct.selled
                },
                { new: true } // Trả về dữ liệu sau khi update
            );

            resolve({
                status: 'OK',
                message: 'Product updated successfully',
                data: updatedProductData
            });
        } catch (e) {
            reject(e);  // Nếu có lỗi, trả về lỗi
        }
    });
};
const updateRating = async (productId, newRating, userId) => {
    try {
        // Tìm sản phẩm theo ID
        const product = await Product.findById(productId);

        if (!product) {
            throw new Error('Sản phẩm không tìm thấy');
        }

        // Nếu userRatings chưa được khởi tạo, khởi tạo nó là một Map rỗng
        if (!product.userRatings) {
            product.userRatings = new Map();
        }

        // Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa
        if (product.userRatings.has(userId)) {
            throw new Error('Người dùng đã đánh giá sản phẩm này rồi');
        }

        // Lấy thông tin số lượng đánh giá và tổng điểm hiện tại
        const totalReviews = product.reviews || 0;
        const totalRating = product.rating || 0;

        // Cập nhật tổng điểm và số lượng đánh giá
        const updatedTotalRating = totalRating * totalReviews + newRating;
        const updatedTotalReviews = totalReviews + 1;

        // Tính toán rating trung bình mới
        const averageRating = updatedTotalRating / updatedTotalReviews;

        // Cập nhật lại thông tin rating và số lượng đánh giá
        product.rating = averageRating;
        product.reviews = updatedTotalReviews;

        // Cập nhật userRatings (thêm rating của userId)
        product.userRatings.set(userId, newRating);  // Sử dụng .set() để thêm giá trị mới vào Map

        // Lưu lại thay đổi
        await product.save();

        return product;
    } catch (error) {
        console.error('Error updating rating:', error);
        throw new Error(error.message);
    }
};


const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Tìm và xóa sản phẩm dựa trên id
            const product = await Product.findByIdAndDelete(id);

            if (!product) {
                resolve({
                    status: 'ERR',
                    message: 'Product not found'
                });
            } else {
                resolve({
                    status: 'OK',
                    message: 'Product deleted successfully'
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};
const getDetailProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Tìm sản phẩm theo id
            const product = await Product.findById(id);
            if (!product) {
                return resolve({
                    status: 'ERR',
                    message: 'Product not found'
                });
            }
            resolve({
                status: 'OK',
                data: product
            });
        } catch (error) {
            reject({
                status: 'ERR',
                message: error.message
            });
        }
    });
};


const getAllDetailProduct = (limit, page = 0, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = {};
            if (filter) {
                query[filter[0]] = { '$regex': `.*${filter[1]}.*`, '$options': 'i' };
            }

            const sortOptions = sort ? { [sort[1]]: sort[0] } : {};

            // Nếu không có limit, chỉ lấy tất cả sản phẩm phù hợp
            const totalProduct = await Product.countDocuments(query);
            const allProduct = await Product.find(query)
                // .select('-image')
                .sort(sortOptions)
                .limit(limit || totalProduct) // Nếu limit không tồn tại, lấy toàn bộ sản phẩm
                .skip(page * (limit || totalProduct)); // Tương tự cho skip

            resolve({
                status: 'OK',
                data: allProduct,
                total: totalProduct,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalProduct / (limit || totalProduct)), // Tính tổng số trang chính xác
            });
        } catch (error) {
            reject({
                status: 'ERR',
                message: error.message,
            });
        }
    });
};
const getAllTypeProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allTypeProduct = await Product.distinct('type');
            resolve({
                status: 'OK',
                data: allTypeProduct,

            });

        } catch (error) {
            reject({
                status: 'ERR',
                message: error.message
            });
        }
    });
};
module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getDetailProduct,
    getAllDetailProduct,
    updateRating,
    getAllTypeProduct// Thêm API getAllDetailProduct vào export
};

