require('dotenv').config();

const io = require('socket.io-client');
const socket = io.connect(process.env.VULCANHUBURL);

const api = require('./api');
const cache = require('./cache');
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

app.post('/stream', async (req, res) => {
  const streamDate = req.body.streamDate;

  try {
    const stream = await getStream(streamDate);

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

app.post('/stream/:id/:event', async (req, res) => {
  const id = req.params.id.toLocaleLowerCase();
  const payload = req.body;

  const stream = payload.stream;

  switch (event) {
    case 'chat':
      await db.saveChat(stream.id, payload);
      break;
    case 'cheer':
      await db.saveCheer(stream.id, payload);
      break;
    case 'contribution':
      await db.saveContribution(stream.id, payload);
      break;
    case 'raid':
      await db.saveRaid(stream.id, payload);
      break;
    case 'subscription':
      await db.saveSubscription(stream.id, payload);
      break;
    case 'follow':
      await db.saveFollow(stream.id, payload);
      break;
    case 'start':
      await db.saveStart(payload);
      break;
    case 'update':
      await db.saveUpdate(stream.id, payload);
      break;
    case 'end':
      await db.saveEnd(stream.id, payload);
      break;
  }
});

app.listen(port, () =>
  console.log(`Stream service listening on port ${port}.`)
);

/**
 * Retrieves a stream based on the provided stream date
 * @param {string} date of the stream
 */
async function getStream(id) {
  let stream;

  // If it exists, get the stream from the cache.
  try {
    stream = await cache.getStream(streamDate);
  } catch (err) {
    console.log(err);
  }

  if (stream) {
    return stream;
  }

  // If we didn't get the stream from the cache, attempt
  // to get it out of the database.
  try {
    stream = await db.getStream(streamDate);
  } catch (err) {
    console.log(err);
  }

  // If we got the stream from the database, add it to
  // the cache for future requests and return it.
  if (stream) {
    try {
      await cache.storeStream(stream);
    } catch (err) {
      console.log(err);
    }
    return stream;
  }

  // If we didn't have the stream in cache or the database,
  // make a call out to the Twitch API to retrieve it.
  try {
    stream = await api.getStream(streamDate);
  } catch (err) {
    console.log(err);
  }

  // If we received the stream from the Twitch API, add it
  // to both the cache and database for future requests.
  if (stream) {
    try {
      await cache.storeStream(stream);
      await db.saveStream(stream);
    } catch (err) {
      console.log(err);
    }
    return stream;
  }

  return undefined;
}
