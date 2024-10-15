const express = require("express");
const router = express.Router();
const userController = require('../controllers/UserController');

router.post('/sig-up', userController.createUser)

router.post('/sig-in', userController.loginUser)

router.put('/update-user/:id', userController.updateUser)
module.exports = router