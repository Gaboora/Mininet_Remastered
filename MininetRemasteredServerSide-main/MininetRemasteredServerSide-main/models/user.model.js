const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    clerkId: {
        type: String,
        required: true
    },
    topologies:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Topo'
        }
    ]
})
module.exports = mongoose.model('User', userSchema);