const express=require('express');
const mongoose=require('mongoose');
require('dotenv').config();
const bcrypt=require('bcryptjs');
const authRoutes=require('./routes/auth.js');
const repoRoutes=require('./routes/repo')
const commitRoutes = require('./routes/commit')
const branchRoutes = require('./routes/branch')
const aiRoutes = require('./routes/ai')
const app=express();
const cors = require('cors')

app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://vortex-frontend.vercel.app' // add your actual Vercel URL!!
    ],
    credentials: true
}))


app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('MongoDB connected'))
.catch((err)=>console.log(err));

app.use('/auth',authRoutes);
app.use('/repos',repoRoutes);
app.use('/commits', commitRoutes);

app.use('/branches', branchRoutes);
app.use('/ai', aiRoutes)

app.get("/",(req,res)=>{
    res.json({message:'vortex api running'});
});

const PORT = process.env.PORT||5000;
app.listen(PORT,()=>{
    console.log("App is listening");
})