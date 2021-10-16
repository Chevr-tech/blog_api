const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        max: 255
    },
    email: {
        type: String,
        require: true,
        max: 255
    },
    password: {
        type: String,
        require: true,
        min: 6,
        max: 1024
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const admin = mongoose.model('Admin', adminSchema)

module.exports = admin;