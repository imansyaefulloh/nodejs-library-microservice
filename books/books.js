const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/ms_books_service', {useNewUrlParser: true}, () => {
  console.log('connected to books_service db');
});

app.get('/', (req, res) => {
  res.send('This is our main endpoint for books service');
});

app.listen(3000, () => console.log('server running at http://localhost:3000'));