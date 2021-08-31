const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const {registerValidation, loginValidation} = require('../validation');
const jwt = require('jsonwebtoken');
const verify = require('../routes/verifyToken');
const verifyToken = require('../routes/verifyToken');
    

router.post('/register',  async (req, res) => {
    const {name, email, password } = req.body;
        // if(error) return res.json({error: error.details[0].message});
    try{
        const {error} = await registerValidation(req.body);
        ///checking if email exist
        const emailExist = await User.findOne({email: email});
        //if email exist throw an error
        if(emailExist) return res.status(400).send({error: `${email} already exist place use another email`})
   
        //hashing the password
        //alogrithm to generate salt 
        const salt = await bcrypt.genSalt(10);

        //hashing the password 
        const hashPassword = await bcrypt.hash(password, salt);

        //creating a new instance of the user
        const user = new User({
            name: name,
            email: email,
            password: hashPassword
        })
        const savedUser = await user.save();
        res.send(savedUser);
    }catch(error){
        res.send({error: error.details[0].message});
    }
})


//Login route
router.post('/login', async (req, res) => {
    const {name, email, password } = req.body;
    try{
        //validating user input
        const {error} = await loginValidation(req.body);
        
        ///checking if email doesn't exist
        const user = await User.findOne({email: email});
        //if email doesn't exist throw an error
        if(!user) return res.status(400).send({error: `Email is not correct`})
     
        // checking if the password is correct
        const validPass = await bcrypt.compare(password, user.password);
        if(!validPass) return res.status(400).send({error: "Password is not correct"});

        //create and assign token
        // also takes a key for expiration time
        const token = jwt.sign(
            {_id: user._id}, 
            process.env.TOKENSecret,
            {expiresIn: '1d'}
            );
        res.header(
            'auth-token', token
        ).redirect('/auth/admin')
        // res.redirect('/')
    }catch(error){
        res.send({error: error.details[0].message});
    }
})


router.post('/logout', (req, res) => {
    req
})


router.get('/admin', verifyToken, (req, res) => {
    
    User.findById(req.user)
    .then(data => {
        res.send(data)
    })
})

module.exports = router;