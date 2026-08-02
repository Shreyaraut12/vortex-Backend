const express = require('express');
const router=express.Router();

const authMiddleware = require('../middleware/auth.js')
const authController = require('../controllers/authController.js')

router.post('/signup', authController.signup)

router.get('/stats', authMiddleware, authController.getStats)

router.post('/login', authController.login)

module.exports=router;
