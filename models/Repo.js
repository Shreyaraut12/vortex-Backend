// Repository has:
// - name
// - description
// - owner (which user created it)
// - when it was created
// - is it public or private?
const mongoose=require('mongoose');
const repoSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true,
    },

    description:{
        type:String
    },

    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    visibility:{
         type: Boolean,
         default: true  // public by default
    }
}

    ,{timestamps:true})
module.exports=mongoose.model('Repo',repoSchema);

