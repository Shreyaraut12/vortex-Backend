const authService=require('../services/authService.js');

const signup = async(req,res)=>{
    try{
        const{username,email,password}=req.body;
        const token = await authService.signup({username,email,password});

        res.status(200).json({
            message:'User created Successfully',
            token:token
        })

    }
    catch(err){
        res.status(err.statusCode || 500).json({message:err.message})
    }
}

const getStats = async(req, res) => {
    try {
        const stats = await authService.getStats(req.userId);
        res.status(200).json(stats)
    } catch(err) {
        res.status(err.statusCode || 500).json({ message: err.message })
    }
}

const login = async(req, res) => {
    try {
       const{email,password}=req.body;
       const token = await authService.login({email,password});

        res.status(200).json({
            message:'login Successfully',
            token:token
        })

    } catch(err) {
        res.status(err.statusCode || 500).json({ message: err.message })
    }
}

module.exports={signup,login,getStats};
