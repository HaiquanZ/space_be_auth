const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forgot-password', userController.sendOTP);
router.post('/confirm-otp', userController.confirmOTP);

router.get('/:id', userController.getUserById);
router.post('/:id', userController.updateUser)

module.exports = router;