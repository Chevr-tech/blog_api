const express = require('express');
const router = express.Router();
const User = require('../models/admin');
const News = require('../models/news');
const bcrypt = require('bcryptjs');
const {newsValidation, loginValidation, newsFieldValidation} = require('../validation');
const jwt = require('jsonwebtoken');
const isAdmin = require('../middleware/isAdmin');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const storage = multer.diskStorage({
    destination:  path.join(__dirname, '../uploads/images'),
    filename: (req, file, cb) => {
        if(file.mimetype.indexOf('image') > -1) {
            const postId = new mongoose.Types.ObjectId();
            req.fileAccepted = true;
            let filename = postId + '_' + Date.now() + '.' + file.mimetype.split('/')[1];
            req.filename = filename;
            req.postId = postId;
            cb(null, filename);
        } else {
            req.fileAccepted = false;
            cb(null, 'rejected');
        }
    }
});
const upload = multer({storage});

//Login route
router.post('/login', async (req, res) => {
    const {name, email, password } = req.body;
    try {
        //validating user input
        const validated = loginValidation(req.body);
        if(validated instanceof Error) return res.status(400).json({error: validated.message})
        
        ///checking if email doesn't exist
        const user = await User.findOne({email: email});
        //if email doesn't exist throw an error
        if(!user) return res.status(400).json({error: `Email or password incorrect`})
     
        // checking if the password is correct
        const validPass = await bcrypt.compare(password, user.password);
        if(!validPass) return res.status(400).json({error: "Email or password incorrect"});

        //create and assign token
        // also takes a key for expiration time
        const token = jwt.sign(
            {_id: user._id}, 
            process.env.TOKENSecret,
            {expiresIn: '1d'}
        );
        res.json({'auth-token': token});
        // res.redirect('/')
    } catch(error){
        console.log(error);
        res.status(500).json({error: 'something went wrong'});
    }
});

//post a new blog 
router.post('/articles', isAdmin, upload.single('image'), async (req, res) => {
    if(!req.fileAccepted) {
        if(req.file && req.file.path) {
            fs.rm(req.file.path, () => {});
            return res.status(400).json({error: 'Only image file types are supported'});
        }        
    }
    const data = req.body;
    const validated = newsValidation(data);
    if(validated instanceof Error) {
        fs.rm(req.file.path, () => {});
        return res.status(400).json({error: validated.message});
    }
    if(data.tags) {
        data.tags = data.tags.split(',');
        data.tags = data.tags.map(tag => tag.trim());
    }
    data.author = req.user._id;
    try{
        data.permalink = encodeURI(data.caption.split(' ').join('-').toLowerCase());
        const count = await News.countDocuments({permalink: data.permalink});
        if(count > 0) return res.status(400).json({error: 'Caption already in use'});
        const articles = new News({...data, _id: req.postId, image: '/images/' + req.filename});
        const result = await articles.save();
        return res.json(result);
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Something went wrong'});
        fs.rmSync(req.file.path);
    }
});

//edit an articles
router.patch('/articles/:id',isAdmin, async (req, res) => {
    const overwritables = ['category', 'caption', 'content'];
    const addables = ['tags'];
    let instructions = req.body.instructions;
    const id = req.params.id;
    let article;
    try {
        article = await News.findById(id);
    } catch(err) {
        if(error.kind === 'ObjectId') return  res.status(404).json({error: 'Article not found'});
        console.log(error)
        return res.json({error: `something went wrong`});
    }
     
    for(var i = 0; i < instructions.length; i++) {
        let action = instructions[i].action;
        let field = instructions[i].field;
        let value = instructions[i].value;
        const validated = newsFieldValidation(field, value);
        if(validated instanceof Error) return res.status(400).json({error: validated.message})
        if(action === 'overwrite') {
            if(overwritables.indexOf(field) < 0) 
            return res.status(400).json({error: `cannot perform "${action}" on "${field}"`});
            article[field] = value;
        } else if(action === 'add') {
            if(addables.indexOf(field) < 0) 
            return res.status(400).json({error: `cannot perform "${action}" on "${field}"`});
            article[field].push(value);
        } else if(action === 'remove') {
            if(addables.indexOf(field) < 0) 
            return res.status(400).json({error: `cannot perform "${action}" on "${field}"`});
            let index = article[field].findIndex(e => e === value);
            if(index < 0)
            return res.status(400).json({error: `cannot find "${value}" in "${field}"`});
            article[field].splice(index, 1);
        } else {
            return res.status(400).json({error: `Invalid action`})
        }
    }
    try{
        article.save();
        res.json(article);
    }catch(error){
        console.log(error);
        res.json({error: `Something went wrong`});
    }
});

//deleting a post 
router.delete('/articles/:id',isAdmin, async(req, res) => {
    const id = req.params.id;
    try{
        const deletedNews = await News.findByIdAndDelete({_id: id});
        if(!deletedNews) return res.status(404).json({error: `News not found`});
        res.json(deletedNews);
    }catch(error){
        if(error.kind === 'ObjectId') return  res.status(404).json({error: 'Article not found'});
        console.log(error)
        res.json({error: error})
    }
}); 

// router.post('/register',  async (req, res) => {
//     const {name, email, password } = req.body;
//         // if(error) return res.json({error: error.details[0].message});
//     try{
//         const validated = registerValidation(req.body);
//         if(validated instanceof Error) res.status(400).json({error: validated.message})
//         ///checking if email exist
//         const emailExist = await User.findOne({email: email});
//         //if email exist throw an error 
//         if(emailExist) return res.status(400).json({error: `${email} already exist please use another email`})
   
//         //hashing the password
//         //alogrithm to generate salt 
//         const salt = await bcrypt.genSalt(10);

//         //hashing the password 
//         const hashPassword = await bcrypt.hash(password, salt);

//         //creating a new instance of the user
//         const user = new User({
//             name: name,
//             email: email,
//             password: hashPassword
//         })
//         const savedUser = await user.save();
//         res.json(savedUser);
//     }catch(error){
//         console.log(error)
//         res.status(500).json({error: 'something went wrong'});
//     }
// });


module.exports = router;