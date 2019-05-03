const mongoose = require('mongoose');

const Customer = mongoose.model('Customer', {
  name: {
    type: String,
    require: true
  },
  age: {
    type: Number,
    require: true
  },
  address: {
    type: String,
    require: true
  }
});

module.exports = Customer