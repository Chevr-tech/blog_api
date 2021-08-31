const mongoose = require('mongoose');

        
const schemaType = {
    type: String,
    require: true
}

const newsSchema = mongoose.Schema({
    tag: {
        type: String,
    },
    author: {
        type: String,
    },
    caption: {
        type: String,
    },
    content: {
        type: String,
    },
    country: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const News = mongoose.model('New', newsSchema)

module.exports = News;
