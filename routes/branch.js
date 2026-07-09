const express=require('express');
const router=express.Router();
const RepoModel=require('../models/Repo.js');
const authMiddleware=require('../middleware/auth.js');
const branchModel=require('../models/branch.js');

router.post('/create',authMiddleware,async(req,res)=>{
    try{
        //1. Get name, repoId, headCommitId from req.body
        const {name,repoId,headCommit}=req.body;

        //2. Check if repo exists
        const repo = await RepoModel.findById(repoId)
        if(!repo){
            return res.status(404).json({message:'Repo not found'})
        }

        //3. Check if branch name already exists 
        //in this repo (no duplicates!!)
        const existingName = await branchModel.findOne({name:name});
        if(existingName){
            return res.status(400).json({message:'Branch name Already Exists'});
        }

        //4.create new branch
        const newBranch = new branchModel({
            name: name,
            repo:repo._id,
            headCommit:headCommit,
            createdBy:req.userId,
                })

            await newBranch.save();

           res.status(200).json({
                message:'branch created Successfully',
                branch:newBranch,
            })  
    }

    catch(err){
        res.status(500).json({message:err.message});
    }
});

router.get('/:repoId',authMiddleware, async(req,res)=>{
    try{
        const {repoId}=req.params
        const branches = await branchModel.find(
            { repo: repoId },
            {},
            { sort: { createdAt: -1 }}
        )
        res.status(200).json({ branches })
    }
    
    catch(err){
        res.status(500).json({message:err.message})
    }
});

module.exports=router;
