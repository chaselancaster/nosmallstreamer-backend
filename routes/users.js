const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../models/User');

router.post('/register', async (req, res) => {
    console.log('register route hit')
})

module.exports = router;