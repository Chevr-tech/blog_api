const mongoose = require('mongoose');

const newsSchema = mongoose.Schema({
    tags: [{
        type: String,
    }],
    category: String,
    image: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    caption: {
        type: String,
    },
    content: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const News = mongoose.model('New', newsSchema)

module.exports = News;
