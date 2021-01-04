const express = require('express');
const { find } = require('../models/Streamer');
const router = express.Router();

require('dotenv').config()

const Streamer = require('../models/Streamer');

router.post('/submit/:name/:vote', async (req, res) => {
    console.log('vote route in back-end hit')
    try {
        const { name, vote } = req.params;
        // let votedStreamer = await Streamer.find({ name: name }).exec();
        // if (votedStreamer.length === 0) {
        //         votedStreamer = await Streamer.create(req.params)
        // }
        // if (vote === "upvote") {
        //     votedStreamer.score++
        //     votedStreamer.save()
        //     res.json({
        //         message: 'Upvote has been given'
        //     })
        // } else if (vote === "downvote") {
        //     votedStreamer.score--
        //     votedStreamer.save()
        //     res.json({
        //         message: 'Downvote has been given'
        //     })
        // }
        const findStreamer = await Streamer.find({ name: name }).exec();
        console.log(findStreamer, '<- findStreamer')
        if (findStreamer.length === 0) {
            const createdStreamer = await Streamer.create(req.params)
            console.log(createdStreamer, '<- createdStreamer')
            if (vote === "upvote") {
                createdStreamer.score++
                createdStreamer.save()
                console.log(createdStreamer, '<- createdStreamer after upvote')
                res.json({
                    message: 'Upvote has been given'
                })
            } else if (vote === "downvote") {
                createdStreamer.score--
                createdStreamer.save()
                console.log(createdStreamer, '<- createdStreamer after downvote')
                res.json({
                    message: 'Downvote has been given'
                })
            } 
            /* else respond err */
        } else {
            if (vote === "upvote") {
                findStreamer[0].score++
                findStreamer[0].save()
                console.log(findStreamer, '<- findStreamer after upvote')
                res.json({
                    message: 'Upvote has been given'
                })
            } else if (vote === "downvote") {
                findStreamer[0].score--
                findStreamer[0].save()
                console.log(findStreamer, '<- findStreamer after downvote')
                res.json({
                    message: 'Downvote has been given'
                })
            } 
        }
    } catch (err) {
        console.log(err, '<- err in submit vote')
    }
})

router.get('/get', async (req, res) => {
    console.log('leaderboard get route hit')
    const streamers = await Streamer.find({})
    // console.log(streamers, '<- streamers')
    res.json({
        streamers
    })
})

module.exports = router;