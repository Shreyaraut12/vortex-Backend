//require mongoose
const mongoose=require('mongoose');

//create user schema and define it 
const userSchema = new mongoose.Schema({
    username: {type:String,required:true,unique:true},
    email: {type:String,required:true,unique:true},
    password:{type:String ,required:true},
}, { timestamps: true })

//export the model
module.exports=mongoose.model('User',userSchema);