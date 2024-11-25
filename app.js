const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const app = express();
const port = 8000;

mongoose.connect('mongodb://localhost:27017/attendance')
    .then(()=>{
        console.log('MongoDB connected');
    })
    .catch(err=>{
        console.log('MongoDB connection failed');
    });
const userSchema = new mongoose.Schema({
    username: {type:String,required:true,unique:true},
    password: {type:String,required:true},
});
const User=mongoose.model('User',userSchema);

app.set('view engine','ejs');
app.set('views','/views');

app.use(express.urlencoded({extended:true}));
app.use(
    session({
        secret: 'mySecret',
        resave: false,
        saveUninitialized: true,
    })
);
app.get('/',(req,res)=>{
    res.render('index',{name:'학생'});
});
app.get('login',(req,res)=>{
    res.render('login');
});
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});