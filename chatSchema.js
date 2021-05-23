const mongoose=require('./mongo');
const mssgSchema=mongoose.Schema({
    from:{
        type:mongoose.Types.ObjectId,
        reuired:true
    },
    to:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model("chatMessage",mssgSchema);