const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forgot-password', userController.sendOTP);

router.get('/:id', userController.getUserById);

module.exports = router;