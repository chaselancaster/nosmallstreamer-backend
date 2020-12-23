const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config()

const User = require('../models/User');

// Register
router.post('/register', async (req, res, next) => {
    console.log('register route hit')
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, password, email } = req.body
        if (!name) {
            return res.send({
              success: false,
              message: 'Name can not be blank.'
            });
          }
        if (!email) {
            return res.send({
              success: false,
              message: 'Email can not be blank.'
            });
          }
        if (!password) {
            return res.send({
              success: false,
              message: 'Password can not be blank.'
            });
          }
        
        const createdUser = await User.create(req.body)
        if (createdUser) {
            req.session.dbId = createdUser._id
            const accessToken = jwt.sign(createdUser.toJSON(), process.env.ACCESS_TOKEN_SECRET)
            res.json({
                user: createdUser,
                success: true,
                accessToken: accessToken
            })
        }
    } catch (err) {
        res.json({ err })
    }
})

// Login
router.post('/login', async (req, res) => {
    console.log('login route hit')
    try {
        const foundUser = await User.findOne({
            email: req.body.email
        })
        if (foundUser) {
            if (bcrypt.compareSync(req.body.password, foundUser.password)) {
                const accessToken = jwt.sign(foundUser.toJSON(), process.env.ACCESS_TOKEN_SECRET)
                req.session.dbId = foundUser._id
                req.session.logged = true;
                res.json({
                    user: foundUser,
                    success: true,
                    accessToken: accessToken
                })
            } else {
                res.json({
                    message: 'Invalid username or password'
                })
            }
        }
    } catch (err) {
        res.json({ err,
        message: 'error logging in' 
        })
    }
})

// Update user
router.put('/update/:id', async (req, res) => {
    const userId = req.session.dbId ||req.params.id
    try {
        const user = await User.findById(userId)
        console.log(user, '<- user in update route')
        // Checking if any field is empty and setting the req.body variable to keep the old info
        if (req.body.password === "") {
            req.body.password = user.password;
            console.log(req.body.password, "<- password when field is blank")
        } else if (req.body.email === "") {
            req.body.email = user.email;
            console.log(req.body.email, "<- email when field is blank")
        } else if (req.body.password === "" && req.body.email === "") {
            res.json({
                message: 'Fill in at least one field to update account.'
            })
        }
        // Hashing password
        if (req.body.password !== "" && req.body.password !== user.password) {
            req.body.password = user.hashPassword(req.body.password)
            console.log(req.body.password, '<- password after hashed')
        }
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
            new: true
        })
        console.log(updatedUser, '<- updatedUser')
        res.json({
            updatedUser,
            success: true
        })
    } catch (err) {
        console.log (err, '<- err in update user')
    }
})

// Update user w/ express-validator
// router.put('/update/:id', [body('email').notEmpty(), body('password').notEmpty()], async (req, res) => {
//     const userId = req.session.dbId ||req.params.id
//     try {
//         // Checking for validation errors
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         const user = await User.findById(userId)
//         console.log(user, '<- user in update route')
//         // Checking if any field is empty and setting the req.body variable to keep the old info
//         // if (req.body.password === "") {
//         //     req.body.password = user.password;
//         //     console.log(req.body.password, "<- password when field is blank")
//         // } else if (req.body.email === "") {
//         //     req.body.email = user.email;
//         //     console.log(req.body.email, "<- email when field is blank")
//         // } else if (req.body.password === "" && req.body.email === "") {
//         //     res.json({
//         //         message: 'Fill in at least one field to update account.'
//         //     })
//         // }
//         // Hashing password
//         if (req.body.password !== "" && req.body.password !== user.password) {
//             req.body.password = user.hashPassword(req.body.password)
//             console.log(req.body.password, '<- password after hashed')
//         }
//         const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
//             new: true
//         })
//         console.log(updatedUser, '<- updatedUser')
//         res.json({
//             updatedUser
//         })
//     } catch (err) {
//         console.log (err, '<- err in update user')
//     }
// })

module.exports = router;