const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../models/User');

router.post('/register', async (req, res, next) => {
    console.log('register route hit')
    // Checking if any fields are blank
  
    // Searching for user or email in the db before registering
    
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

module.exports = router;