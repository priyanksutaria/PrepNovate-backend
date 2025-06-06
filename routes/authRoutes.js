const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const checkAdmin = require('../utils/checkAdmin');

router.post('/admin/register', authController.registerAdmin);
router.post('/admin/login', authController.loginAdmin);

router.post('/user/register', checkAdmin, authController.registerUser);
router.post('/user/login', authController.loginUser);

module.exports = router;
