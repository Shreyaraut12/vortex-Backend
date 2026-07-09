const mongoose=require('mongoose');

const branchSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },

    repo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Repo',
        required:true,
    },

    headCommit:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Commit',
        required:true,

    },

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
},
{timestamps:true});

module.exports=mongoose.model('Branch',branchSchema);