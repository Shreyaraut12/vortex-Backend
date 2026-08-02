const express=require('express');
const router= express.Router();
const authMiddleware=require('../middleware/auth.js');
const commitController=require('../controllers/commitController.js');

router.post('/create', authMiddleware, commitController.createCommit)

router.get('/:repoId', authMiddleware, commitController.listCommits)

module.exports=router;
