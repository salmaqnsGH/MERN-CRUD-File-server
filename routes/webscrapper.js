const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

router.get('/', (req, res) => {
    const url = 'https://www.forbes.com/30-under-30/2021/social-impact/';
    axios(url)
        .then(response=>{
        const html = response.data;
        const $ = cheerio.load(html)
        const articles = []

        // $('h1', html).each(function(){
        //     const title = $(this).text()
        //     articles.push(title)
        // })
        
        console.log(articles)
        return res.status(200).send({html})
    })
    .catch( (err) =>console.log(err))
});



        
    

module.exports = router; 