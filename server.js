const express=require('express');
const app=express();
const jwtoken=require('jsonwebtoken');
const http=require('http');
const server=http.createServer(app);
const io=require('socket.io')(server);
const router=express.Router();
const User=require('./userModel')
const chatMessage=('./chatSchema')
var bodyParser = require("body-parser");

app.get('/',(req,res)=>{
    res.send('Runnning....');
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/user',require('./userRoutes'));

// app.listen(3000);
// console.log("Listening to PORT 3000");

let connectedUser=[];
let userConnected={};
io.on('connection',(socket)=>{
    //authentication of user...
    io.use(async (socket,next)=>{
        let token=JSON.parse(socket.handshake.query.token);
        if(token){
        const verifiedUser=jwtoken.verify(token,"THIS-IS-CHAT-APPLICATION");
        user=await User.findOne({"_id":verifiedUser._id});
        if (user){
            socket.id=user._id;
            console.log('User verified...');
            next();
        }
        else{
            throw new Error('Invalid User.')
        }
    }
    else{
        throw new Error('Problem exists with Sockets.')
    }
    })
    

    //Event called on login of user..
    socket.on('loggedIn',(user)=>{
        connectedUser.push({...user});
        userConnected[user._id]=socket.id.toString();
        console.log(userConnected);
        io.emit('connected user list',userConnected);
    })

    //Event called on sending message...
    socket.on('chatMessage',async function(data){
        prev_message= await chatMessage.findOne({$and:[{'from':socket.id},{'to':data.reciver}]},'message').lean();
        socket.to(userConnected[data.reciver]).emit('message',data);
        if (!prev_message){
            prev_message=''
            prev_message+=" "+data;
        }
        else{
        prev_message+='\n'+data;
        }
        await chatMessage.replaceOne({$and:[{'from':socket.id},{'to':data.reciver}]},{'message':prev_message,'date':new Date().toISOString()});
        
    })

    //Event called on disconnection of user...
    socket.on('disconnection',(socket)=>{
        console.log('user disconnected...');
        connectedUser=connectedUser.filter((item)=>{
            item.id!=socket.id;
        let c=socket.id.toString()
        delete userConnected[c];
        io.emit('updatedUserList',connectedUser);
        })
    })
})

server.listen(3000,()=>{
    console.log('server running on port 3000');
});

