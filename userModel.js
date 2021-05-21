
const mongoose=require('./mongo');
const userSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    name:{
        type:String,
        required:true,
        trim:true
    }
});

module.exports=mongoose.model("User",userSchema);