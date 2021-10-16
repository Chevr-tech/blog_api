require('./dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 5000;

//Routes 
const indexRoutes = require('./routes');
const adminRoutes = require('./routes/admin')

app.use(express.static("uploads"));
app.use(express.json())
app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept,X-Auth-token,X-Username');

    res.setHeader('Access-Control-Allow-Credentials', true);
	
    next();
});

app.get('/api', (req, res, next) => {
    res.json({
        routes: [
            'GET /articles',
            'GET /articles/<ARTICLE_ID>',
            'contact developer for admin routes 😉'
        ]
    });
});
app.use('/api', indexRoutes);
app.use('/api/admin', adminRoutes);
app.use('*', (req, res, next) => {
    res.json({error: 'Resource not found'});
});


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
    console.log(err);
});