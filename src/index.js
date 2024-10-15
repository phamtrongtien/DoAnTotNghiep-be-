const express = require("express");
const dotenv = require('dotenv');
const mongoose = require('mongoose'); // Bạn đã quên import mongoose
const routes = require("./routes");
const bodyParser = require("body-parser");
dotenv.config(); // Đọc các biến môi trường từ tệp .env

const app = express();
const port = process.env.PORT || 2002;

app.get('/', (req, res) => {
    res.send('Hello Nommar nice');
});
app.use(bodyParser.json())

routes(app);

// Kết nối tới MongoDB
mongoose.connect('mongodb://localhost:27017/WebBanHang', {  // Thêm tùy chọn và đặt tên cho database
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connect DB success!');
    })
    .catch((err) => {
        console.log('Connect DB failed:', err);  // Hiển thị lỗi nếu có
    });

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
