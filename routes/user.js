const express = require('express');
const router = express.Router();
const User = require('../models/user')
const fs = require('fs');


router.post('/api/files', async (req, res) => {
    try{
        const user = await User.findOne({email: req.body.email})
        // res.send(users);
        const userId  = await user._id
        const dir = `./folder-apps/data/${userId}`
        // let userFile = user.file
        fs.readdirSync(dir).forEach(files => {
            return userFiles = files
        });

        

        res.status(200).json({user, userFiles})

    }catch(err){
        res.status(500).json({message: err.message || `Internal server error`})
    }
});

router.post('/api/auth/register', async (req, res) => {
    try{
        let user = new User({ 
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
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
        res.status(201).json({data:user}) 
    }catch(err){
        res.status(500).json({ message: err.message || `internal server error` })
    }
});

router.post('/api/auth/signin', async(req, res) => {

    try{
        const user = await User.findOne({
            email: req.body.email
        }).then((user)=>{
            if(user){
                if(user.password == req.body.password ){
                    res.status(200).json({user})
                }else{
                    res.status(403).json({ message: 'Password yang anda masukkan salah' }) 
                }
            }else{
                res.status(403).json({ message: 'Email yang anda masukkan belum terdaftar' })    
            }
        })
    }catch(err){
        res.status(500).json({ message: err.message || `internal server error` })
    }
});

module.exports = router; 