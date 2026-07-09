const mongoose = require('mongoose');

const commitSchema=new mongoose.Schema({
    message:{
        type:String,
        required:true,
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    repo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Repo',
        required:true,
    },
    files:[{type:String}],
    
    parentCommit:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Commit',
        default:null
    },
    hash:{
        type:String,
        required:true,
        unique:true,
    },

},{timestamps:true});

module.exports=mongoose.model('Commit',commitSchema);