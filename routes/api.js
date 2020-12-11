const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.post('/:name', async (req, res) => {
    console.log('name route it')
    try {
        const tokenCall = await fetch('https://id.twitch.tv/oauth2/token?client_id=wwwoxzpshnwpnko2nehgbmc0c52r82&client_secret=sk9s9er4zjzxr36zyy58lmtl0077h7&grant_type=client_credentials', { method: 'POST' 
        })
        const token = await tokenCall.json();
        console.log(token.access_token, '<- token in Twitch call')
        const game = await fetch(`https://api.twitch.tv/helix/games?name=${req.params.name}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token.access_token}`,
                'Client-Id': process.env.CLIENT_ID
            }
        })
        const parsedGame = await game.json()
        console.log(parsedGame, '<- parsedGame')
    } catch (err) {
        console.log(err, '<- err in token call')
    }
})

module.exports = router