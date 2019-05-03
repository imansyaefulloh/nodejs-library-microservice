const axios = require('axios');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const ObjectId = require('mongoose').Types.ObjectId;

const Order = require('./Order');

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/ms_orders_service', {useNewUrlParser: true}, () => {
  console.log('connected to orders_service db');
});

/**
 * Create new order
 */
app.post('/orders', (req, res) => {
  let { CustomerID, BookID, initialDate, deliveryDate } = req.body;
  
  let newOrder = {
    CustomerID,
    BookID,
    initialDate,
    deliveryDate
  };

  let order = new Order(newOrder);

  order.save()
    .then(() => res.send('create new order success'))
    .catch(err => {
      if (err) {
        console.log('error when trying to create order: ' + err)
      }
    });
});

/**
 * Get all orders
 */
app.get('/orders', (req, res) => {
  Order.find({})
    .then(orders => res.json(orders))
    .catch(err => {
      if (err) {
        console.log('error when trying to get all orders: ' + err)
      }
    });
});

/**
 * Get single orders
 */
app.get('/orders/:id', (req, res) => {
  let orderId = req.params.id;

  if (!ObjectId.isValid(orderId)) {
    console.log('invalid ObjectId');
    return res.sendStatus(404);
  }

  Order.findById(orderId)
    .then(order => {
      if (order) {
        axios.get(`http://localhost:3001/customers/${order.CustomerID}`)
          .then(response => {
            let orderObject = {
              customerName: response.data.name,
              bookTitle: ''
            };
            axios.get(`http://localhost:3000/books/${order.BookID}`)
              .then(response => {
                orderObject.bookTitle = response.data.title
                res.send(orderObject);
              })
              .catch(err => {
                if (err) {
                  console.log('error when trying to get book: ' + err)
                }
              });
          })
          .catch(err => {
            if (err) {
              console.log('error when trying to get customer: ' + err)
            }
          });
      } else {
        res.sendStatus(404);
      }
    })
    .catch(err => {
      if (err) {
        console.log('error when trying to find order: ' + err)
      }
    });
});

app.listen(3002, () => console.log('order service running at http://localhost:3002'));