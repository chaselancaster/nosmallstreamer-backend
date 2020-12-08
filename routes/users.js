const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../models/User');

router.post('/register', async (req, res, next) => {
    console.log('register route hit')
    try {
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

module.exports = router;