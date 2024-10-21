const Product = require('../models/ProductModel');

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, type, price, countInStock, rating, description } = newProduct;

        try {
            // Kiểm tra xem sản phẩm có tồn tại không
            const checkProduct = await Product.findOne({ name });

            if (checkProduct !== null) {
                return resolve({
                    status: 'ERR',
                    message: "The product name is already registered"
                });
            }

            // Tạo sản phẩm mới
            const createdProduct = await Product.create({
                name, image, type, price, countInStock, rating, description
            });

            // Trả về kết quả tạo thành công
            if (createdProduct) {
                resolve({
                    status: 'OK',
                    message: 'Product created successfully',
                    data: createdProduct
                });
            }
        } catch (e) {
            reject({
                status: 'ERR',
                message: e.message // Trả về thông điệp lỗi
            });
        }
    });
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
                    description: updatedProduct.description
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

const getAllDetailProduct = (limit = 8, page = 0, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Lấy tổng số sản phẩm
            const totalProduct = await Product.countDocuments(); // Nên sử dụng countDocuments thay vì count
            if (filter) {
                const label = filter[0];
                console.log(label)
                const allProductFilter = await Product.find({ [label]: { '$regex': `.*${filter[1]}.*`, '$options': 'i' } }).limit(limit).skip(page * limit)
                resolve({
                    status: 'OK',
                    data: allProductFilter,
                    total: totalProduct,
                    pageCurrent: Number(page + 1), // Trang hiện tại
                    totalPage: Math.ceil(totalProduct / limit) // Tổng số trang
                });
            }
            if (sort) {
                const objectSort = {

                }
                objectSort[sort[1]] = sort[0];
                const allProductSort = await Product.find()
                    .limit(limit)
                    .skip(page * limit)
                    .sort(objectSort);
                resolve({
                    status: 'OK',
                    data: allProductSort,
                    total: totalProduct,
                    pageCurrent: Number(page + 1), // Trang hiện tại
                    totalPage: Math.ceil(totalProduct / limit) // Tổng số trang
                });
            }
            // Tính số sản phẩm bỏ qua dựa trên số trang và giới hạn
            // Điều chỉnh skip dựa trên trang hiện tại
            const allProduct = await Product.find().limit(limit).skip(page * limit);
            resolve({
                status: 'OK',
                data: allProduct,
                total: totalProduct,
                pageCurrent: Number(page + 1), // Trang hiện tại
                totalPage: Math.ceil(totalProduct / limit) // Tổng số trang
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
    getAllDetailProduct // Thêm API getAllDetailProduct vào export
};
