const mongoose = require('mongoose');

const newsSchema = mongoose.Schema({
    tags: [{
        type: String,
    }],
    category: String,
    image: String,
    permalink: { type: String, unique: true },
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

newsSchema.index({permalink: 1});

const News = mongoose.model('New', newsSchema)

module.exports = News;
