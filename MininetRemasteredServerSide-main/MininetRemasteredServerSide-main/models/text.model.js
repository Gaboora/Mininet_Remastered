const mongoose = require('mongoose');

const textSchema = new mongoose.Schema({
    text: {
        type: String,
    },
    position: {
        type: Object,
        default: { x: 100, y: 200 }
    },
    topoId: {
        type: String
    },
})

module.exports = mongoose.model('Text', textSchema);