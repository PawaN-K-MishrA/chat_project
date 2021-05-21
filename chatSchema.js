const mongoose=require('./mongo');
const mssgSchema=mongoose.Schema({
    from:{
        type:String,
        reuired:true,
        trim:true
    },
    to:{
        type:String,
        required:true,
        trim:true
    },
    message:{
        type:String,
        required:true,
    },
    date:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model("chatMessage",mssgSchema);