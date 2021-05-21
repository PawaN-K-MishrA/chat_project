const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/chatProject',{useNewUrlParser: true, useUnifiedTopology: true},
(err)=>{
    if(!err){
        console.log('sucessfully connected with database...');
    }
    else{
        console.log('Problem in connecting with database...')
    }
});

module.exports=mongoose;