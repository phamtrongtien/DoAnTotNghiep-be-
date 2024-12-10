const UserRouter = require('./UserRouter')
const ProductRouter = require('./ProductRouter')
const OrderRouter = require('./OrderRouter')
const PaymentRouter = require('./PaymentRouter')
const feedBackRouter = require('./feedBackRouter')

const routes = (app) => {
    // Định nghĩa route cho trang user
    app.use('/api/user', UserRouter);
    app.use('/api/order', OrderRouter);
    app.use('/api/product', ProductRouter);
    app.use('/api/payment', PaymentRouter)
    app.use('/api/feedback', feedBackRouter)

};

module.exports = routes;
