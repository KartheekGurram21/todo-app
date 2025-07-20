// start writing from here
const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
// const todoRoutes = require('./routes.todo');

const port = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const app = express();

mongoose.connect(process.env.MONGO_URI).then(() => console.log("connected to db successfully")).catch(err => console.log(err));

app.use(express.json());

app.use('/api/user', userRoutes);
// app.use('/api/todo', todoRoutes);

app.listen(port, () => {
    console.log(`server is running on https://localhost:${port}`);
})