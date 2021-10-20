const express = require('express')
const router = express.Router();
const News = require('../models/news');

//all blog list
router.get('/articles', async (req, res) => {
    let page = req.query.page;
    page = Number(page);
    if(!page) page = 1;
    let limit = 10;
    let count;
    try {
        count = await News.countDocuments({}).populate('author');
    } catch (err) {
        console.log(err)
        count = 0;
    }
    News.find().sort({date: -1}).skip((page - 1) * limit).limit(limit)
    .then(data => {
        res.json({
            articles: data,
            count,
            limit,
            page
        });
    })
    .catch(err => {
        console.log({err: err})
    });
})

// fetch a  particular artcile
router.get('/articles/:id', async (req, res) => {
    const id = req.params.id; 
    try{
        const article = await News.findById(id).populate('author');
        if(!article) res.status(404).json({error: 'Article not found'});
        res.json(article);
    } catch(error){
        if(error.kind === 'ObjectId') return  res.status(404).json({error: 'Article not found'});
        console.log(error)
        res.json({error: `Something went wrong`});
    }
})

module.exports = router;