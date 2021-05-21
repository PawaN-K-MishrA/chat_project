const express=require('express');
const app=express();
const http=require('http');
const server=http.createServer(app);
const io=require('socket.io')(server);
const router=express.Router();
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
    console.log('User Connected...');
    
    //Event called on login of user..
    socket.on('loggedIn',(user)=>{
        connectedUser.push({...user});
        userConnected[user._id]=socket.id.toString();
        console.log(userConnected);
        io.emit('connected user list',userConnected);
    })

    //Event called on sending message...
    socket.on('chatMessage',function(data){
        socket.to(userConnected[data.reciver]).emit('message',data);
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

