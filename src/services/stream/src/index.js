require('dotenv').config();

const io = require('socket.io-client');
const socket = io.connect(process.env.VULCANHUBURL);

const api = require('./api');
const cache = require('./cache');
const db = require('./db');

socket.on('streamUpdate', async payload => {
  if (payload && payload.stream) {
    try {
      const streamDate = payload.stream.started_at.toLocaleDateString('en-US', {
        timeZone: 'America/Chicago'
      });

      let stream = await db.getStream(streamDate);

      if (stream) {
        await db.saveStream(payload.stream);
      } else {
        // The stream has started. Save it and emit to socket.io
        stream = payload.stream;
        stream.streamDate = streamDate;
        stream = await db.saveStart(stream);
        socket.emit('streamStart', stream);
      }
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

socket.on('requestCredits', async payload => {
  if (payload && payload.streamDate) {
    try {
      const stream = await db.getFullStream(payload.streamDate);
      if (stream) {
        socket.emit('onCreditRoll', { stream });
      }
    } catch (err) {
      console.log(err);
    }
  }
});

const express = require('express');
const app = express();
const port = 80;

app.use(express.json());

app.get('/stream', async (req, res) => {
  const streamDate = new Date().toLocaleDateString('en-US');
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

/**
 *
 * @param id The _id property of the stream
 */
app.post('/stream/:id/:event', async (req, res) => {
  const id = req.params.id.toLocaleLowerCase();
  const event = req.params.event;
  const payload = req.body;

  const stream = payload.stream;

  switch (event) {
    case 'chat':
      await db.saveChat(id, payload);
      break;
    case 'cheer':
      await db.saveCheer(id, payload);
      break;
    case 'contribution':
      await db.saveContribution(id, payload);
      break;
    case 'raid':
      await db.saveRaid(id, payload);
      break;
    case 'subscription':
      await db.saveSubscription(id, payload);
      break;
    case 'follow':
      await db.saveFollow(id, payload);
      break;
    case 'moderator':
      await db.saveModerator(id, payload);
      break;
  }
});

app.listen(port, () =>
  console.log(`Stream service listening on port ${port}.`)
);

/**
 * Retrieves a stream based on the provided stream date
 * @param {string} streamDate of the stream
 */
async function getStream(streamDate) {
  let stream;

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
    return stream;
  }

  // If we didn't have the stream in database,
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
      stream = await db.saveStart(stream);
    } catch (err) {
      console.log(err);
    }
    return stream;
  }

  return undefined;
}
