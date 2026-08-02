const express=require('express');
const router=express.Router();
const authMiddleware=require('../middleware/auth.js')
const repoController=require('../controllers/repoController.js')

router.post('/create', authMiddleware, repoController.createRepo)

router.get('/list', authMiddleware, repoController.listRepos)

module.exports=router;
