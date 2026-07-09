const express = require('express');
const router=express.Router();

const User=require('../models/user.js');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

router.post('/signup',async(req,res)=>{
    try{
        const{username,email,password}=req.body;
        const existingUser = await User.findOne({email:email});
        if(existingUser){
            return res.status(400).json({message:'User Already Exists'});
        }

        const hashedPassword=await bcrypt.hash(password,10)
        //The second argument is called "salt rounds" — it determines how strong the hashing is.

        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
                })

            await newUser.save();
        
            const token=jwt.sign(
                {id:newUser._id},
                process.env.JWT_SECRET,
                {expiresIn:'7d'}
            )

            res.status(200).json({
                message:'User created Successfully',
                token:token
            })

    }
    catch(err){
        res.status(500).json({message:err.message})
    }
})

router.post('/login', async(req, res) => {
    try {
       const{email,password}=req.body;
        
        // step 2 — find user by email
        // hint: User.findOne()
        // step 3 — if no user found → error
        const existingUser=await User.findOne({email:email});
        if(!existingUser){
            return res.status(400).json({message:'User not Found'});
        }
        
        // step 4 — compare passwords
        // hint: bcrypt.compare(password, user.password)
        // returns true or false
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
        
        // step 5 — if wrong password → error
        if(!isPasswordCorrect) {
        return res.status(400).json({ message: 'Invalid credentials' })
                    }
        
        // step 6 — generate JWT token
        // same as signup!
        const token=jwt.sign(
                {id:existingUser._id},
                process.env.JWT_SECRET,
                {expiresIn:'7d'}
            )

            // step 7 — send token back
            res.status(200).json({
                message:'login Successfully',
                token:token
            })
        
        
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports=router;