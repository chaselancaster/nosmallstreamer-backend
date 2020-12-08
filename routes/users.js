const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../models/User');

router.post('/register', async (req, res, next) => {
    console.log('register route hit')
    try {
        const { username, password, email } = req.body
        if (!email) {
            return res.send({
              success: false,
              message: 'Email cannot be blank.'
            });
          }
        if (!password) {
            return res.send({
              success: false,
              message: 'Password cannot be blank.'
            });
          }
        
        const createdUser = await User.create(req.body)
        if (createdUser) {
            req.session.dbId = createdUser._id
            res.json({
                user: createdUser,
                success: true
            })
        }
    } catch (err) {
        res.json({ err })
    }
})

router.post('/login', async (req, res) => {
    console.log('login route hit')
    try {
        const foundUser = await User.findOne({
            email: req.body.email
        })
        if (foundUser) {
            if (bcrypt.compareSync(req.body.password, founderUser.password)) {
                req.session.dbId = foundUser._id
                req.session.logged = true;
                res.json({
                    user: foundUser,
                    success: true
                })
            } else {
                res.json({
                    message: 'Invalid username or password'
                })
            }
        }
    } catch (err) {
        res.json({ err })
    }
})

module.exports = router;