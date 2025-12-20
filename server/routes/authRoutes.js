const express = require('express');
const router = express.Router();

// ১. সঠিক নাম (login, register) ইম্পোর্ট করুন
const { login, register } = require('../controllers/authController');

// ২. রাউট সেটআপ
router.post('/register', register); // রেজিস্টার রাউটও যোগ করে দিলাম
router.post('/login', login);       // ✅ এখানে 'loginUser' এর বদলে 'login' হবে

module.exports = router;