const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { register, login, adminLogin, setAdminPassword, googleLogin, forgotPassword, resetPassword, sendEmailCode, verifyEmailCode } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);
// FIX: setAdminPassword agora requer autenticação de admin
router.post('/set-admin-password', authMiddleware, setAdminPassword);
router.post('/google', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/send-code', sendEmailCode);
router.post('/verify-code', verifyEmailCode);

module.exports = router;
