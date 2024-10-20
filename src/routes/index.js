const UserRouter = require('./UserRouter')
const ProductRouter = require('./ProductRouter')
const routes = (app) => {
    // Định nghĩa route cho trang user
    app.use('/api/user', UserRouter);


    app.use('/api/product', ProductRouter);
};

module.exports = routes;
