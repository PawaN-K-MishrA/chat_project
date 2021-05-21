const express=require('express');
const routes=express.Router();
const controller=require('./controller');


routes.post('/loginUser',controller.loginUser);
routes.post('/registerUser',controller.registerNewUser);
routes.get('/listAll',controller.getAll);

module.exports=routes;