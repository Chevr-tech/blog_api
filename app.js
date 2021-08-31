const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const multer = require('multer');
const cors = require('cors');
const port = 5000 || process.env.PORT;
require('dotenv').config();

//Routes 
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth')

app.use(express.json())
app.use(cors());

app.use('/', indexRoutes);
app.use('/auth', authRoutes)


mongoose.connect(process.env.DBconnection, 
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    })
.then(() => {
    console.log('DB connected successfully')
    app.listen(port, () => {
        console.log(`Server started on port ${port}`)
    })
})
.catch(err => {
    res.json({error: err})
})
