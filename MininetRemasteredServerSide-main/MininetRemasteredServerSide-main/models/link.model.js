const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
    link:{
        type:Object
    }
})

module.exports = mongoose.model('Link', linkSchema);