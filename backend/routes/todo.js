//  start writing your code from here
const { Router } = require('express');
const userAuth = require('../middleware/user');
const { Todo } = require('../db/index');

const router = Router();

router.post('/create-todo', userAuth, async (req, res) => {
    try {
        const userId = req.userId;
        const { title } = req.body;
        const data = await Todo.create({
            userId: userId,
            title: title
        });
        res.status(200).json({
            todoId: data._id,
            message: "Todo created successfully"
        });
    } catch(err) {
        console.log(err);
    }
});

router.put('/update-todo', userAuth, async (req, res) => {
    try {
        const userId = req.userId;
        const { todoId, title, isDone } = req.body;
        await Todo.updateOne({
            userId: userId,
            _id: todoId
        }, {
            $set: {
                title: title,
                isDone: isDone
            }
        });
        res.status(200).json({
            message: "todo updated successfully"
        });
    } catch(err) {
        console.log(err);
    }
});

router.delete('/delete-todo', userAuth, async (req, res) => {
    try {
        const userId = req.userId;
        const { todoId } = req.body;
        await Todo.deleteOne({
            userId: userId,
            _id: todoId
        });
        res.status(200).json({
            message: "todo deleted successfully"
        });
    } catch(err) {
        console.log(err);
    }
});


module.exports = router;