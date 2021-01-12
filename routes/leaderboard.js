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
    const profileImageUrl = parsedStreamer.data[0].profile_image_url
    return profileImageUrl
}

router.post('/submit/:name/:vote/:user_id', async (req, res) => {
    console.log('vote route in back-end hit')
    try {
        const { name, vote, user_id } = req.params;
        const findStreamer = await Streamer.find({ name: name }).exec();
        const streamerProfileImage = await getStreamerProfileImage(user_id)
        if (findStreamer.length === 0) {
            findStreamer = await Streamer.create({
                name,
                user_id,
                profile_image_url: streamerProfileImage
            })
        }
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
    } catch (err) {
        console.log(err, '<- err in submit vote')
    }
})

router.get('/get', async (req, res) => {
    console.log('leaderboard get route hit')
    const streamers = await Streamer.find({})
    res.json({
        streamers
    })
})

module.exports = router