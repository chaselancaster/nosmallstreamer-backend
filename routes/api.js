const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/:name', async (req, res) => {
    console.log('api name route hit')
})

module.exports = router;