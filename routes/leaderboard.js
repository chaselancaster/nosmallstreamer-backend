const express = require('express');
const { find } = require('../models/Streamer');
const router = express.Router();

require('dotenv').config()

const Streamer = require('../models/Streamer');

router.post('/submit/:name/:vote', async (req, res) => {
    console.log('vote route in back-end hit')
    try {
        const { name, vote } = req.params;
        const findStreamer = await Streamer.find({ name: name }).exec();
        if (findStreamer.length === 0) {
            const createdStreamer = await Streamer.create(req.params)
            console.log(createdStreamer, '<- createdStreamer')
            if (vote === "upvote") {
                createdStreamer.score++
                createdStreamer.save()
                res.json({
                    message: 'Upvote has been given'
                })
            } else if (vote === "downvote") {
                createdStreamer.score--
                createdStreamer.save()
                res.json({
                    message: 'Downvote has been given'
                })
            } 
        } else {
            if (vote === "upvote") {
                findStreamer[0].score++
                findStreamer[0].save()
                res.json({
                    message: 'Upvote has been given'
                })
            } else if (vote === "downvote") {
                findStreamer[0].score--
                findStreamer[0].save()
                res.json({
                    message: 'Downvote has been given'
                })
            } 
            console.log(findStreamer, '<- findStreamer after votes')
        }
    } catch (err) {
        console.log(err, '<- err in submit vote')
    }
})

module.exports = router;