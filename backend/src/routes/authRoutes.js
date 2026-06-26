const express = require('express');
const router = express.Router();
const { register, login, adminLogin, googleLogin, forgotPassword, resetPassword, sendEmailCode, verifyEmailCode } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.post('/google', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/send-code', sendEmailCode);
router.post('/verify-code', verifyEmailCode);

module.exports = router;