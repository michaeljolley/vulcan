const express = require('express');
const app = express();
const port = 80;

require('dotenv').config();

app.use(express.static('src/wwwroot'));

app.get('/socketio', (req, res) =>
  res.send({ socketIOUrl: process.env.VULCANHUBURL })
);

app.listen(port, () =>
  console.log(`Overlay service listening on port ${port}.`)
);
