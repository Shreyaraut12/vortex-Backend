const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth.js')
const aiController = require('../controllers/aiController.js')

router.post('/generate-commit', authMiddleware, aiController.generateCommitMessage)

module.exports = router
