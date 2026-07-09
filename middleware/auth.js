const jwt=require('jsonwebtoken');

const authMiddleware=(req,res,next)=>{

    try{
 //See that next parameter? That's special to middleware. When you call next() it means "okay security check passed, continue to the route."
 
 // step 1 — get token from headers
 const token = req.headers.authorization?.split(' ')[1]
    // Authorization: "Bearer eyJhbG..."
    // split by space → ["Bearer", "eyJhbG..."]
    // [1] → gets just the token part


    // step 2 — if no token → 401 error
    if(!token){
       return res.status(401).json({message:'Unauthorized user'});
    }

     // step 3 — verify token
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    //1. Checks if token is valid
    //2. Returns the payload we stored → { id: userId }

     // step 4 — attach userId to request
    req.userId=decoded.id

    // step 5 — call next()
    next()// go to the actual route now!!
}

    catch(err){
        res.status(401).json({message:'Invalid token'})
    }
}

module.exports=authMiddleware