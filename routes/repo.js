const express=require('express');
const router=express.Router();
const repoModel=require('../models/repo.js');
const authMiddleware=require('../middleware/auth.js')

// 1. Get repo name, description, visibility from req.body
// 2. Create new repo with owner = req.userId
//    (remember middleware attaches userId to request!!)
// 3. Save to MongoDB
// 4. Send back the created repo

router.post('/create', authMiddleware, async(req, res) => {
    try{
    // authMiddleware runs first!!
    const {name,description,visibility}=req.body;

    // step 1 — check if name exists
     if(!name) {
        return res.status(400).json({ message: 'Repo name is required' })
    }

    // step 2 — create new repo
    const newRepo = new repoModel({
            name: name,
            description: description,
            owner: req.userId,
            visibility:visibility,
                })
    
             await newRepo.save();   

    // if token valid → comes here
    // req.userId is available here!!

    res.status(201).json({
                message:'Repo created Successfully',
                repo:newRepo
            })
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
})

router.get('/list',authMiddleware,async (req,res)=>{
    try{
        // step 1 — find all repos where owner = req.userId

         console.log('userId:', req.userId) 
      const repos = await repoModel.find({ owner: req.userId})
      console.log('repos found:', repos.length) // add this!!
    
    // step 2 — send them back
    res.status(200).json({ repos: repos })
// that's it!! no saving here!!
    }

    catch(err){
        console.log('error:', err.message) 
        return res.status(500).json({message:err.message});
    }
})

module.exports=router;