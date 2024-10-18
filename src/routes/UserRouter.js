const express = require("express");
const router = express.Router();
const userController = require('../controllers/UserController');
const { authMiddleware } = require("../middleware/authMiddleware");

router.post('/sig-up', userController.createUser)

router.post('/sig-in', userController.loginUser)

router.put('/update-user/:id', userController.updateUser)

router.delete('/delete-user/:id', authMiddleware, userController.deleteUser)

router.get('/getALL', authMiddleware, userController.getAllUser)

router.get('/get-details/:id', authMiddleware, userController.getDetailUser)


module.exports = router