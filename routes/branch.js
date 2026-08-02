const express=require('express');
const router=express.Router();
const authMiddleware=require('../middleware/auth.js');
const branchController=require('../controllers/branchController.js');

router.post('/create', authMiddleware, branchController.createBranch)

router.get('/:repoId', authMiddleware, branchController.listBranches)

module.exports=router;
