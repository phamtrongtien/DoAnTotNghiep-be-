const express = require("express");
const router = express.Router();
const userController = require('../controllers/UserController');
const { authMiddleware, authUserMiddleware } = require("../middleware/authMiddleware");

router.post('/sig-up', userController.createUser)

router.post('/sig-in', userController.loginUser)

router.put('/update-user/:id', userController.updateUser)

router.delete('/delete-user/:id', authMiddleware, userController.deleteUser)

router.get('/getALL', authMiddleware, userController.getAllUser)

router.get('/get-details/:id', authUserMiddleware, userController.getDetailUser)

router.post('/refresh-token', userController.refreshToken)


module.exports = router