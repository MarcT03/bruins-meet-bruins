const mongoose = require("mongoose")
//model for connection, two users swipe right on each other
const MyConnections = new mongoose.Schema({
    userId1: {
        type: String,
        required: true
    },
    userId2:{
        type: String,
        required: true
    },
    time:{
        type: Date,
        default: Date.now
    }

}, { collection: 'connections' });

module.exports = mongoose.model("connections", MyConnections)