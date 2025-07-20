//  start writing from here
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    password: String
});

const todoSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    title: String,
    isDone: {
        type: Boolean,
        default: false
    }
});

const User = mongoose.model('user', userSchema);
const Todo = mongoose.model('todo', todoSchema);

module.exports = {
    User,
    Todo
};