const express = require('express');
const { default: fetch } = require('node-fetch');
const { find } = require('../models/Streamer');
const router = express.Router();

require('dotenv').config()

const Streamer = require('../models/Streamer');

const getStreamerProfileImage = async (id) => {
    const streamer = await fetch(`https://api.twitch.tv/helix/users?id=${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
                'Client-Id': process.env.CLIENT_ID
            }
        })
    const parsedStreamer = await streamer.json()
    // console.log(parsedStreamer, '<- parsedStreamer')
    const profileImageUrl = parsedStreamer.data[0].profile_image_url
    // console.log(profileImageUrl, "<- profileImageUrl")
    return profileImageUrl
}

router.post('/submit/:name/:vote/:user_id', async (req, res) => {
    console.log('vote route in back-end hit')
    try {
        const { name, vote, user_id } = req.params;
        // console.log(user_id, '<- user_id')
        const findStreamer = await Streamer.find({ name: name }).exec();
        // console.log(findStreamer, '<- findStreamer')
        const streamerProfileImage = await getStreamerProfileImage(user_id)
        if (findStreamer.length === 0) {
            const createdStreamer = await Streamer.create(req.params)
            // console.log(createdStreamer, '<- createdStreamer')
            if (vote === "upvote") {
                createdStreamer.score++
                createdStreamer.save()
                // console.log(createdStreamer, '<- createdStreamer after upvote')
                res.json({
                    message: 'Upvote has been given'
                })
            } else if (vote === "downvote") {
                createdStreamer.score--
                createdStreamer.save()
                // console.log(createdStreamer, '<- createdStreamer after downvote')
                res.json({
                    message: 'Downvote has been given'
                })
            } 
            /* else respond err */
        } else {
            if (vote === "upvote") {
                findStreamer[0].score++
                findStreamer[0].save()
                // console.log(findStreamer, '<- findStreamer after upvote')
                res.json({
                    message: 'Upvote has been given'
                })
            } else if (vote === "downvote") {
                findStreamer[0].score--
                findStreamer[0].save()
                // console.log(findStreamer, '<- findStreamer after downvote')
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