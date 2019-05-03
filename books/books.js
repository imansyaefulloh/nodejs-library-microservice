const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const ObjectId = require('mongoose').Types.ObjectId;

const Book = require('./Book');

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/ms_books_service', {useNewUrlParser: true}, () => {
  console.log('connected to books_service db');
});

app.get('/', (req, res) => {
  res.send('This is our main endpoint for books service');
});

/**
 * Get all books
 */
app.get('/books', (req, res) => {
  Book.find({})
    .then(books => res.json(books))
    .catch(err => console.log(err));
});

/**
 * Get single books
 */
app.get('/books/:id', (req, res) => {
  const bookId = req.params.id;
  
  if (!ObjectId.isValid(bookId)) {
    console.log('invalid ObjectId');
    return res.sendStatus(404);
  }

  Book.findById(bookId)
    .then(book => {
      if (book) {
        res.json(book)
      } else {
        res.sendStatus(404);
      }
    })
    .catch(err => {
      if (err) {
        console.log('error in catch: ' + err)
      }
    });
});

/**
 * Create a new book
 */
app.post('/books', (req, res) => {
  const { title, author, numberPages, publisher } = req.body;
  
  let newBook = {
    title,
    author,
    numberPages,
    publisher
  };

  let book = new Book(newBook);

  book.save()
    .then(() => console.log('new book created'))
    .catch(err => console.log(err));

  res.send('create new book success');
});

app.listen(3000, () => console.log('server running at http://localhost:3000'));