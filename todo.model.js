const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    completed: {
        type: Boolean,
        default: false
    },
}, {timestamps: true});

module.exports = mongoose.model('Todo', todoSchema);