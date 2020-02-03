require('dotenv').config();

const io = require('socket.io-client');
const socket = io.connect(process.env.VULCANHUBURL);
const db = require('./db');

socket.on('streamStart', async payload => {
  if (payload && payload.stream) {
    try {
      await db.saveStream(payload.stream);
    } catch (err) {
      console.log(err);
    }
  }
});

socket.on('streamUpdate', async payload => {
  if (payload && payload.stream) {
    try {
      await db.saveStream(payload.stream);
    } catch (err) {
      console.log(err);
    }
  }
});

socket.on('streamEnd', async payload => {
  if (payload && payload.stream) {
    try {
      await db.endStream(payload.stream);
    } catch (err) {
      console.log(err);
    }
  }
});

const express = require('express');
const app = express();
const port = 80;

app.use(express.json());

app.get('/stream/:streamDate', async (req, res) => {
  const streamDate = req.params.streamDate.toLocaleLowerCase();

  try {
    const stream = await db.getStream(streamDate);

    if (stream) {
      res.json(stream);
      return;
    }
  } catch (err) {
    console.log(err);
  }

  // If the stream couldn't be found in any service, return
  // a 404 (Not Found).
  res.sendStatus(404);
});

app.listen(port, () =>
  console.log(`Stream service listening on port ${port}.`)
);
