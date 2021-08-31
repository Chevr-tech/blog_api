const express = require('express')
const router = express.Router();
const News = require('../models/news');

//all blog list
router.get('/', (req, res) =>{
    News.find()
    .then(data => {
        res.json({
            articles: data
        })
    })
    .catch(err => {
        console.log({err: err})
    })
})

//post a new blog 
router.post('/articles', async (req, res) => {
    const data = req.body;
    const articles = new News(data);
    try{
        const result = await articles.save();
        return res.send('data saved');
    }catch(error){
        res.json({error: error})
    }
    // .then(data => {
    //     return res.json(data);
    // })
    // .then(data => {
    //     res.json(data)
    // })
    // .catch(err => {
    //     res.json({error: err})
    // })
})

// fetch a  particular artcile
router.get('/articles/:id', async (req, res) => {
    const id = req.params.id; 
    try{
        const article = await News.findById(id);
        res.json(article);
    } catch(error){
        res.json({error: `couldn't fetch of id - ${id}`})
    }
})

//edit an articles
router.patch('/article/edit/:id',async (req, res) => {
    // console.log(req.body)

    const {tag, author, caption, content, country} = req.body;
    const id = req.params.id;
    try{
        const updatedaArticle = await News.updateOne({_id: id}, 
            {$set: {
                tag: tag,
                author: author,
                caption: caption,
                content: content,
                country: country,
            }
        });
        // console.log(updatedaArticle);
        res.json(updatedaArticle); 
    }catch(error){
        res.json({error: `couldn't fetch of id - ${id}`})
    }
})

//deleting a post 
router.delete('/articles/:id', async(req, res) => {
    const id = req.params.id;
    try{
        const deletedNews = await News.deleteOne({_id: id})
        res.json(deletedNews);
        console.log('deleted news')
    }catch(error){
        res.json({error: error})
    }
})

module.exports = router;