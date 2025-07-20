//  start writing your code from here
const { Router } = require('express');
const bcrypt = require('bcrypt');
const zod = require('zod');
const jwt = require('jsonwebtoken');
const userAuth = require('../middleware/user');
const { User, Todo } = require('../db/index');
const router = Router();

const signupSchema = zod.object({
  email: zod.string().email(),
  password: zod.string()
    .min(3, { message: "Password must be at least 3 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" })
    .refine(val => /[a-z]/.test(val), { message: "Must include a lowercase letter" })
    .refine(val => /[A-Z]/.test(val), { message: "Must include an uppercase letter" })
    .refine(val => /[0-9]/.test(val), { message: "Must include a number" })
    .refine(val => /[@#$]/.test(val), { message: "Must include a special character (@, #, $)" })
});

const loginSchema = zod.object({
  email: zod.string().email(),
  password: zod.string()
    .min(3, { message: "Password must be at least 3 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" })
    .refine(val => /[a-z]/.test(val), { message: "Must include a lowercase letter" })
    .refine(val => /[A-Z]/.test(val), { message: "Must include an uppercase letter" })
    .refine(val => /[0-9]/.test(val), { message: "Must include a number" })
    .refine(val => /[@#$]/.test(val), { message: "Must include a special character (@, #, $)" })
});

router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const requestObject = {
            email: email,
            password: password
        };
        const result = signupSchema.safeParse(requestObject);
        if(!result.success) {
            console.log(result.error);
            return res.status(400).json({
                data: result.error
            });
        }
        const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));
        requestObject.password = hashedPassword;

        await User.create(requestObject);
        res.json({
            message: "signed up successfully"
        });
    } catch(err) {
        console.log(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const requestObject = {
            email: email,
            password: password
        };
        const result = loginSchema.safeParse(requestObject);
        if(!result.success) {
            return res.status(400).json({
                data: result.error
            });
        }
        const user = await User.findOne({
            email: email
        });
        if(!user) {
            return res.status(404).json({
                message: "No user found"
            });
        }
        const matchedPassword = await bcrypt.compare(password, user.password);
        if(!matchedPassword) {
            return res.status(403).json({
                message: "Invalid password"
            });
        }

        const token = jwt.sign({
            userId: user._id
        }, process.env.JWT_SECRET);


        res.json({
            message: "signed in successfully",
            token: token
        });
    } catch(err) {
        console.log(err);
    }
});

router.get('/get-todos', userAuth, async (req, res) => {
    try {
        const userId = req.userId;
        const todos = await Todo.find({ 
            userId: userId
        });
        if(todos.length === 0) {
            return res.status(200).json({
                data: [],
                message: "No results found"
            });
        } else {
            return res.status(200).json({
                data: todos,
                message: "Todos fetched successfully"
            });
        }

    } catch(err) {
        console.log(err);
    }
});

module.exports = router;