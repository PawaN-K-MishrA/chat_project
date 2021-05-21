const User=require('./userModel')
const nodemailer=require('nodemailer')
const jwtoken=require('jsonwebtoken');
require('dotenv').config();
const bcrypt=require('bcryptjs');


exports.registerNewUser = async (req,res)=>{
  
    if (!req.body.email || !req.body.Password || !req.body.name){
        return res.status(400).send({message:"required field cannot be empty..."});
    }

let exist=await User.findOne({'email':req.body.email}).exec()
if(exist){
    res.send('Email must be unique...');
  }
else{
    let new_pwd=await bcrypt.hash(req.body.Password,10);
    const user=await User.create({
      email:req.body.email,
      password:new_pwd,
      name:req.body.name
    })
    
    let token=await jwtoken.sign({id:user._id},"THIS-IS-CHAT-APPLICATION");
    console.log('tokenjson--->',token);
    res.send(user);

    let mailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'new139352.34@gmail.com',
        pass: 'Password@12'
        }
      });

    let mailDetails = {
      from: 'new139352.34@gmail.com',
      to: req.body.email,
      subject: 'Test mail',
      text: 'Node.js testing mail for Chat Application by Pawan.'
    };

    mailTransporter.sendMail(mailDetails, function(err, data) {
      if(err) {
        console.log('Error Occurs %s',err);
      } else {
        console.log('Email sent successfully to: ',req.body.email);
      }
      });
}}

exports.getAll=(req,res)=>{
  User.find()
  .then((data)=>{
    res.send(data);
  })
  .catch((err)=>{
    res.send('Error',err);
  })
}

   exports.loginUser = async (req,res)=>{
     try{
      console.log('login--->',req.body)
      if (!req.body.email || req.body.password){
          throw new Error('Email or Password Missing...');
        }
      let user=await User.findOne({'email':req.body.email});
      if(!user || !(await bcrypt.compare(req.body.Password,user.password))){
        throw new Error('Unauthorized Access....');
      }
      const token = await jwtoken.sign({id:user._id},"THIS-IS-CHAT-APPLICATION");
      console.log(token)
      res.send(user);
    }
    catch (err){
      res.send(err.message);
    }
    };