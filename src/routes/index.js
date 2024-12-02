const UserRouter = require('./UserRouter')
const ProductRouter = require('./ProductRouter')
const OrderRouter = require('./OrderRouter')

const routes = (app) => {
    // Định nghĩa route cho trang user
    app.use('/api/user', UserRouter);
    app.use('/api/order', OrderRouter);
    app.use('/api/product', ProductRouter);
};

module.exports = routes;
