const User=require('../models/user.js');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const generateToken = (userId) => {
    return jwt.sign(
        {id:userId},
        process.env.JWT_SECRET,
        {expiresIn:'7d'}
    )
}

const signup = async({username,email,password})=>{
    const existingUser = await User.findOne({email:email});
    if(existingUser){
        const error = new Error('User Already Exists');
        error.statusCode = 400;
        throw error;
    }

    const hashedPassword=await bcrypt.hash(password,10)
    //The second argument is called "salt rounds" — it determines how strong the hashing is.

    const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword,
    })

    await newUser.save();

    return generateToken(newUser._id);
}

const login = async({email,password})=>{
    // step 2 — find user by email
    const existingUser=await User.findOne({email:email});
    if(!existingUser){
        const error = new Error('User not Found');
        error.statusCode = 400;
        throw error;
    }

    // step 4 — compare passwords
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)

    // step 5 — if wrong password → error
    if(!isPasswordCorrect) {
        const error = new Error('Invalid credentials');
        error.statusCode = 400;
        throw error;
    }

    return generateToken(existingUser._id);
}

const getStats = async(userId) => {
    const user = await User.findById(userId);
    return {
        username: user.username,
        totalXP: user.totalXP,
        streak: user.streak,
        lastCommitDate: user.lastCommitDate,
        badges: user.badges
    }
}

module.exports={signup,login,getStats};
