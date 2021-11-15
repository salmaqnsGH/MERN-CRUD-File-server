const mongoose = require('mongoose');
const userRouter = require('./routes/user');
const express = require('express');
const app = express();
var cors = require('cors')

app.use(cors())

mongoose.connect('mongodb://127.0.0.1:27017/memoora')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/',cors(), userRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));