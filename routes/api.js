const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/:name/:viewers', async (req, res) => {
    console.log('name route it')
    try {
        const game = await fetch(`https://api.twitch.tv/helix/games?name=${req.params.name}`, {
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
        const filteredStreams = parsedStreams.data.filter(
            s => s.viewer_count <= req.params.viewers
        );
        console.log(filteredStreams, '<- filteredStreams')
        // res.json({
        //     streams: parsedStreams,
        //     success: true
        // })
    } catch (err) {
        console.log(err, '<- err in call')
    }
})




// Method to get token
// const tokenCall = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=client_credentials`, { method: 'POST' 
 // })
 // const parsedToken = await tokenCall.json();
 // const token = parsedToken
// console.log(token, '<- token in Twitch call')

module.exports = router