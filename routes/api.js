const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.post('/:name', async (req, res) => {
    console.log('name route it')
    try {
        const tokenCall = await fetch('https://id.twitch.tv/oauth2/token?client_id=wwwoxzpshnwpnko2nehgbmc0c52r82&client_secret=sk9s9er4zjzxr36zyy58lmtl0077h7&grant_type=client_credentials', { method: 'POST' 
        })
        const parsedToken = await tokenCall.json();
        const token = parsedToken.access_token
        console.log(token, '<- token in Twitch call')
        const game = await fetch(`https://api.twitch.tv/helix/games?name=${req.params.name}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Client-Id': process.env.CLIENT_ID
            }
        })
        const parsedGame = await game.json()
        console.log(parsedGame, '<- parsedGame')
        const gameId = parsedGame.data[0].id
        console.log(gameId, '<- gameId')
        const tokenCall2 = await fetch('https://id.twitch.tv/oauth2/token?client_id=wwwoxzpshnwpnko2nehgbmc0c52r82&client_secret=sk9s9er4zjzxr36zyy58lmtl0077h7&grant_type=client_credentials', { method: 'POST' 
        })
        const parsedToken2 = await tokenCall2.json()
        const token2 = parsedToken2.access_token
        console.log(parsedToken2, '<-- parsedToken2')
        // const streams = await fetch(`https://api.twitch.tv/helix/streams?game_id=${gameId}&first=100`, {
        //     method: 'GET',
        //     headers: {
        //         'Authorization': `Bearer ${token2}`,
        //         'Cliend-Id': process.env.CLIENT_ID,
        //     }
        // })
        // const parsedStreams = await streams.json()
        // console.log(parsedStreams, '<- parsedStreams')
    } catch (err) {
        console.log(err, '<- err in token call')
    }
})

module.exports = router