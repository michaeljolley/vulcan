require('dotenv').config();

const signalR = require('@aspnet/signalr');
const express = require('express');
const app = express();
const port = 3000;

const db = require('./db');

app.use(express.json());

app.post('/stream/:streamDate', async (req, res) => {
  const streamDate = req.params.streamDate.toLocaleLowerCase();

  if (!req.body || !req.body.fields) {
    res.sendStatus(500);
    return;
  }

  const fields = req.body.fields;

  try {
    const stream = await db.getStream(streamDate, ...fields);

    if (stream) {
      res.json(stream);
      return;
    }
  } catch (err) {
    console.log(err);
  }

  // If the user couldn't be found in any service, return
  // a 404 (Not Found).
  res.sendStatus(404);
});

app.put('/stream/:streamDate', async (req, res) => {
  if (!req.body || !req.body.stream) {
    res.sendStatus(500);
    return;
  }

  const newStream = req.body.stream;

  try {
    const stream = await db.updateStream(newStream);

    if (stream) {
      res.json(stream);
      return;
    }
  } catch (err) {
    console.log(err);
  }

  // If the user couldn't be found in any service, return
  // a 404 (Not Found).
  res.sendStatus(404);
});

app.listen(port, () =>
  console.log(`Stream service listening on port ${port}.`)
);

// Build connection to SignalR service
const signalRConnection = new signalR.HubConnectionBuilder()
  .withUrl('/chat')
  .build();

/**
 * When streams need to be updated.  Payload will look like:
 * {
 *  stream
 * }
 */
signalRConnection.on('updateStream', async data => {
  console.log(data);

  if (data.stream) {
    try {
      await db.updateStream(data.stream.streamDate, data.stream);
    } catch (err) {
      console.log(err);
    }
  }
});

// Connect to SignalR service
signalRConnection.start();
