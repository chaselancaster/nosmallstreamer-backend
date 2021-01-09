const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { default: fetch } = require('node-fetch');

require('dotenv').config()

const User = require('../models/User');

const getStreamerProfileImage = async (id) => {
    const streamer = await fetch(`https://api.twitch.tv/helix/users?id=${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
                'Client-Id': process.env.CLIENT_ID
            }
        })
    const parsedStreamer = await streamer.json()
    const profileImageUrl = parsedStreamer.data[0].profile_image_url
    return profileImageUrl
}

// Register
router.post('/register', async (req, res, next) => {
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
    try {
        const { email, password } = req.body
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
        const foundUser = await User.findOne({
            email: email
        })
        if (foundUser) {
            if (bcrypt.compareSync(password, foundUser.password)) {
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
        consosle.log (err, '<- err in update user')
    }
})

router.post('/watchlater/add/:id/:name/:user_id', async (req, res) => {
    try {
    const { id, name, user_id } = req.params
    const user = await User.findById(id)
    const array = user.watchLater
    const streamerProfileImage = await getStreamerProfileImage(user_id)
    for (let i = 0; i < array.length; i++) {
        if (array[i] === name) {
            return res.json({
                message: 'User already in watch later.',
                user: user
            })
        }
    }
    user.watchLater.push({
        name,
        user_id,
        profile_image_url: streamerProfileImage
    })
    user.save()
    res.json({
        message: 'User added to watch later.',
        user: user
    })
    } catch (err) {
        console.log(err, '<- error in adding user to watchLater.')
    } 
})

router.delete('/watchlater/:id/:streamer/', async (req, res) => {
    const { id, streamer} = req.params;
    const user = await User.findById(id)
    for (let i = 0; i < user.watchLater.length; i++) {
        if (user.watchLater[i].name === streamer) {
            user.watchLater.splice(i, 1)
            user.save()
            res.json({
                message: 'Streamer successfully deleted',
                user: user
            })
        }
    }
})

module.exports = router;