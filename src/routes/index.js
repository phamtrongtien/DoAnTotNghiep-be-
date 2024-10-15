const UserRouter = require('./UserRouter')
const routes = (app) => {
    // Định nghĩa route cho trang user
    app.use('/api/user', UserRouter);

    // Định nghĩa thêm một route cho trang product
    app.get('/product', (req, res) => {
        res.send('Product page');
    });
};

module.exports = routes;
