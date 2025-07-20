//  start writing from here
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    password: String,
    firstName: String,
    lastName: String
});

const todoSchema = new Schema({
    userId: Schema.Types.ObjectId,
    tite: String,
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