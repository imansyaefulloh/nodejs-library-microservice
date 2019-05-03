const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const ObjectId = require('mongoose').Types.ObjectId;

// const Book = require('./Book');

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/ms_orders_service', {useNewUrlParser: true}, () => {
  console.log('connected to orders_service db');
});

app.get('/', (req, res) => {
  res.send('This is our main endpoint for books service');
});

app.listen(3000, () => console.log('book service running at http://localhost:3000'));