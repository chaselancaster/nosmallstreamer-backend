const express = require('express');
const router = express.Router();

require('dotenv').config()

const Streamer = require('../models/Streamer');

router.post('/submit/:name/:vote', (req, res) => {
    console.log('vote route in back-end hit')
    console.log(req.params, 'req.params')
    // const { name, vote } = req.params;
    // console.log(`${name}, ${vote}`)
})

module.exports = router;