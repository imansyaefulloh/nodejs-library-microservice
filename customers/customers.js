const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ObjectId = require('mongoose').Types.ObjectId;

const Customer = require('./Customer');

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/ms_customers_service', {useNewUrlParser: true}, () => {
  console.log('connected to customers_service db');
});

/**
 * Create new customer
 */
app.post('/customers', (req, res) => {
  const { name, age, address } = req.body;

  let newCustomer = {
    name,
    age,
    address
  };

  let customer = new Customer(newCustomer);

  customer.save()
    .then(() => res.send('create new customer success'))
    .catch(err => {
      if (err) {
        console.log('error when trying to creating customer: ' + err)
      }
    })
});

/**
 * Get all customers
 */
app.get('/customers', (req, res) => {
  Customer.find({})
    .then(customers => res.json(customers))
    .catch(err => {
      if (err) {
        console.log('error when trying to get all customers: ' + err)
      }
    });
});

/**
 * Get single customer
 */
app.get('/customers/:id', (req, res) => {
  let customerId = req.params.id;

  if (!ObjectId.isValid(customerId)) {
    console.log('invalid ObjectId');
    return res.sendStatus(404);
  }

  Customer.findById(customerId)
    .then(customer => {
      if (customer) {
        res.json(customer)
      } else {
        res.sendStatus(404);
      }
    })
    .catch(err => {
      if (err) {
        console.log('error when trying to find customer: ' + err)
      }
    });
});

/**
 * Delete customer
 */
app.delete('/customers/:id', (req, res) => {
  let customerId = req.params.id;
  console.log(customerId);

  if (!ObjectId.isValid(customerId)) {
    console.log('invalid ObjectId');
    return res.sendStatus(404);
  }

  Customer.findByIdAndRemove(customerId)
    .then(() => res.send('delete customer success'))
    .catch(err => {
      if (err) {
        console.log('error when trying to remove customer: ' + err)
      }
    })
});

app.listen(3001, () => console.log('customer service running at http://localhost:3001'));