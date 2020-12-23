const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

require('dotenv').config()

const authenticateToken = (req, res, next) => {
    console.log('authenticateToken func hit')
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

const findStreams = async (gameId) => {
    const streams = {};
    while (streams.length === 0) {
        const fetchCall = await fetch(`https://api.twitch.tv/helix/streams?game_id=${gameId}&first=100`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
                'Client-Id': process.env.CLIENT_ID,
            }
        })
        const parsedFetchCall = await fetchCall.json()
        streams = parsedFetchCall.data
    }
    return streams
}

router.get('/stream/:name/:viewers', authenticateToken, async (req, res) => {
    console.log('first stream route it')
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
        // console.log(parsedGame, '<- parsedGame')
        const gameId = parsedGame.data[0].id
        // console.log(gameId, '<- gameId')
        const streams = await fetch(`https://api.twitch.tv/helix/streams?game_id=${gameId}&first=100`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
                'Client-Id': process.env.CLIENT_ID,
            }
        })
        const parsedStreams = await streams.json()
        // console.log(parsedStreams, '<- parsedStreams')
        const cursor = parsedStreams.pagination.cursor
        const filteredStreams = parsedStreams.data.filter(
            s => s.viewer_count <= viewers
        );
        // if (filteredStreams.length === 0) {
        //     console.log('if statement hit')
        //     const testStreams = await fetch(`https://api.twitch.tv/helix/streams?game_id=${gameId}&first=100&after=${cursor}`, {
        //         method: 'GET',
        //         headers: {
        //             'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
        //             'Client-Id': process.env.CLIENT_ID,
        //         }
        //     })
        //     const parsedTestStreams = await testStreams.json()
        //     console.log(parsedTestStreams, '<- parsedTestStreams') 
        // }
        res.json({
            streams: filteredStreams,
            success: true,
            gameId,
            cursor
        })
        // console.log(filteredStreams, '<- filteredStreams')
    } catch (err) {
        console.log(err, '<- err in stream call')
    }
})

router.get('/more/:gameId/:cursor', async (req, res) => {
    console.log(req.params, '<- req.params')
    try {
        const moreStreams = await fetch(`https://api.twitch.tv/helix/streams?game_id=${req.params.gameId}&after=${req.params.cursor}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
                'Client-Id': process.env.CLIENT_ID
            }
        })
        const parsedMoreStreams = await moreStreams.json()
        console.log(parsedMoreStreams, '<- parsedMoreStreams')
        const cursor = parsedMoreStreams.pagination.cursor
        res.json({
            moreStreams: parsedMoreStreams.data,
            cursor
        })
    } catch (err) {
        console.log(err, '<- err in load more route')
    }
})


// Method to get token
// const tokenCall = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=client_credentials`, { method: 'POST' 
//  })
//  const parsedToken = await tokenCall.json();
//  const token = parsedToken
// console.log(token, '<- token in Twitch call')

module.exports = router