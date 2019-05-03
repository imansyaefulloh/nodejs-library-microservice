const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('This is our main endpoint for books service');
});

app.listen(3000, () => console.log('server running at http://localhost:3000'));