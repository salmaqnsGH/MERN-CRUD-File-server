const express = require('express');
const router = express.Router();
const User = require('../models/user')
const fs = require('fs');


router.get('/api/files', async (req, res) => {
    try{
        const users = await User.find().select('_id name')
        // res.send(users);
        res.status(200).json(users)

    }catch(err){
        res.status(500).json({message: err.message || `Internal server error`})
    }
});

router.post('/api/register', async (req, res) => {
    try{
        let user = new User({ 
            name: req.body.name,
            email: req.body.email,
            country: req.body.country
        });
        
        
        const dir = "./folder-apps/data"
        const userId  = await user._id
        // create random file name
        const fileName = Math.random().toString(36).substring(2);

        if (!fs.existsSync(`${dir}/${userId}`)) {
            fs.mkdirSync(`${dir}/${userId}`, { recursive: true }, (err) => {
                if (err) throw err;
            });
        }

        const writeStream = fs.createWriteStream(`${dir}/${userId}/${fileName}.yml`);
        
        writeStream.write("EMAIL:" + req.body.email);
        writeStream.write("\n");
        writeStream.write("NAME:" + req.body.name);

        writeStream.end()

        writeStream.on("end", () => {
            console.log("Finished writing");
        });
        
        writeStream.on("error", (error) => {
            console.log(error.stack);
        });
        
        user = await user.save();
        res.status(201).json(user) 
    }catch(err){
        res.status(500).json({ message: err.message || `internal server error` })
    }
});

module.exports = router; 