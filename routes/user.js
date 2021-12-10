const express = require('express');
const router = express.Router();
const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const UserFile = require('../models/file')
const fs = require('fs');
const config = require('../config')
const {isLogin} = require('../middlewares/auth')

router.post('/api/auth/register', async (req, res, next) => {
    try{
        const payload = req.body
        let user = new User(payload);
        
        await user.save();

        const userId  = await user._id
        const dir = "./folder-apps"
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

        const content = "EMAIL: "+ req.body.email + "\n" + "NAME: " + req.body.name

        const dataUserFile = {
            userId: userId,
            fileName: `${fileName}.yml`,
            content: content
        }

        const userFile = new UserFile(dataUserFile)
        await userFile.save()
        
        delete user._doc.password //delete password output
        res.status(201).json({ data:{user,userFile} }) 

    } catch (err) {
        if(err && err.name === "ValidationError"){
            //422: unable to be processed
          return res.status(422).json({
            error: 1,
            message: err.message,
            fields: err.errors
          })
        }
        next(err)
      }
});

router.post('/api/auth/signin', async(req, res) => {
    const { email, password } = req.body
    
    User.findOne({email: email}).then((user)=>{
            if(user){
                const checkPassword = bcrypt.compareSync(password, user.password)
                if(checkPassword){
                    const token = jwt.sign({
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            country: user.country,
                        }
                    }, config.jwtKey)
                    res.status(200).json({
                        data: {token}
                    })
                }else{
                    res.status(403).json({ message: 'Wrong password' })
                }
            }else{
                res.status(403).json({ message: "Email could not be found" })    
            }
        }).catch((err)=>{
            res.status(500).json({ message: err.message || `internal server error` })
        })
});

router.get('/api/countries', async (req, res) => {
    axios.get('https://restcountries.com/v3.1/all')
  .then(function (response) {
    // handle success
    const countries= response.data.map((v) => v.name.common)
    return res.status(200).send({data: countries})
  })
  .catch(function (error) {
    // handle error
    res.status(500).json({message: err.message || `Internal server error`})
  })
});

router.get('/api/files', isLogin, async (req, res) => {
    try{
        const data = await UserFile.find({userId: req.user.id})
        res.status(200).send({data})
    }catch(err){
        res.status(500).json({message: err.message || `Internal server error`})
    }
});

router.post('/api/addFile', isLogin, async (req, res) => {
    try{
        const userId  = req.user.id
        const dir = `./folder-apps/${userId}`

        // create random file name
        const fileName = Math.random().toString(36).substring(2);
        if (!fs.existsSync(`${dir}`)) {
            fs.mkdirSync(`${dir}`, { recursive: true }, (err) => {
                if (err) throw err;
            });
        }
        const writeStream = fs.createWriteStream(`${dir}/${fileName}.yml`);
        writeStream.write(req.body.message);
        writeStream.end()

        const content = req.body.message

        const dataUserFile = {
            userId: userId,
            fileName: `${fileName}.yml`,
            content: content
        }

        const userFile = new UserFile(dataUserFile)
        await userFile.save()

        res.status(200).send({data: {dataUserFile}})

    } catch (err) {
        res.status(500).json({message: err.message || `Internal server error`})
    }
});

router.post('/api/updateFile', isLogin, async (req, res) => {
    try{
        const userId  = req.user.id
        const fileName = req.body.fileName
        const content = req.body.content
        const userFile = await UserFile.findOne({fileName :fileName})
        const dir = `./folder-apps/${userId}`

        
        const writeStream = fs.createWriteStream(`${dir}/${fileName}`);
        writeStream.write(content);
        writeStream.end()
        
        userFile.content = content
        await userFile.save()

        res.status(200).send({data: userFile})

    } catch (err) {
        console.log(err)
        res.status(500).json({message: err.message || `Internal server error`})
    }
});

router.delete('/api/deleteFile', isLogin, async (req, res) => {
    try{
        const userId  = req.user.id
        const file  = req.query.file
        const dir = `./folder-apps/${userId}/${file}`

        fs.unlink(dir, (err => {
            if (err) res.status(500).json({message: err.message || `Internal server error`});
            else {
            console.log("\nDeleted dir:", dir);
            res.status(200).send({data: {dir}})
            }
        }));

        await UserFile.deleteOne({fileName:file})
    } catch (err) {
        res.status(500).json({message: err.message || `Internal server error`})
    }
});

module.exports = router; 