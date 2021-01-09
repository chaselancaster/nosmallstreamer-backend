const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

require('dotenv').config()

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

router.get('/stream/:name/:viewers', authenticateToken, async (req, res) => {
    try {
        const { name, viewers } = req.params
        const game = await fetch(`https://api.twitch.tv/helix/games?name=${name}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
                'Client-Id': process.env.CLIENT_ID
            }
        })
        const parsedGame = await game.json()
        const gameId = parsedGame.data[0].id
        const streams = await fetch(`https://api.twitch.tv/helix/streams?game_id=${gameId}&first=100`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
                'Client-Id': process.env.CLIENT_ID,
            }
        })
        const parsedStreams = await streams.json()
        const cursor = parsedStreams.pagination.cursor
        const filteredStreams = parsedStreams.data.filter(
            s => s.viewer_count <= viewers
        );
        res.json({
            streams: filteredStreams,
            success: true,
            gameId,
            cursor
        })
    } catch (err) {
        console.log(err, '<- err in stream call')
    }
})

router.get('/more/:gameId/:cursor', async (req, res) => {
    try {
        const moreStreams = await fetch(`https://api.twitch.tv/helix/streams?game_id=${req.params.gameId}&after=${req.params.cursor}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
                'Client-Id': process.env.CLIENT_ID
            }
        })
        const parsedMoreStreams = await moreStreams.json()
        const cursor = parsedMoreStreams.pagination.cursor
        res.json({
            moreStreams: parsedMoreStreams.data,
            cursor
        })
    } catch (err) {
        console.log(err, '<- err in load more route')
    }
})


// Method to get Twitch token
// const tokenCall = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=client_credentials`, { method: 'POST' 
//  })
//  const parsedToken = await tokenCall.json();
//  const token = parsedToken
// console.log(token, '<- token in Twitch call')

module.exports = router