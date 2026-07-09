const express=require('express');
const router= express.Router();
const commitModel=require('../models/commit.js');
const repoModel=require('../models/repo.js');
const authMiddleware=require('../middleware/auth.js');
const crypto=require('crypto');

router.post('/create', authMiddleware, async(req, res) => {
    try {
        //step 1:get data from req.body:

        const {message,repoId,files}=req.body;

        //step 2: check if repo exists:
        const repo=await repoModel.findById(repoId);
        if(!repo){
            return res.status(404).json({message:'Repo not found'})
        }

        //step 3:find the LAST commit of this repo.
        const lastCommit = await commitModel.findOne(
            { repo: repo._id },
            {},
            { sort: { createdAt: -1 }}
        )

        //step 4 : generate SHA-256 hash
        const hash = crypto
        .createHash('sha256')
        .update(`${message}${req.userId}${repoId}${Date.now()}`)
        .digest('hex')

         //step 5: create and save commit:

         const newCommit =new commitModel({
            message:message,
            author: req.userId,
            repo:repo._id,
            files:files,
            parentCommit: lastCommit ? lastCommit._id : null,
            hash:hash,
         })
         await newCommit.save();

         res.status(201).json({
        message: 'Commit created successfully',
        commit: newCommit
    })
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:repoId', authMiddleware, async(req, res) => {
    try {
        const { repoId } = req.params
        const commits = await commitModel.find(
            { repo: repoId },
            {},
            { sort: { createdAt: -1 }}
        )
        res.status(200).json({ commits })
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports=router;