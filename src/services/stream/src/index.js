require('dotenv').config();

const io = require('socket.io-client');
const socket = io.connect(process.env.VULCANHUBURL);
const streamService = require('./streamService');

socket.on('streamStart', async payload => {
  if (payload && payload.stream) {
    try {
      await streamService.saveStream(payload.stream);
    } catch (err) {
      console.log(err);
    }
  }
});

socket.on('streamUpdate', async payload => {
  if (payload && payload.stream) {
    try {
      await streamService.saveStream(payload.stream);
    } catch (err) {
      console.log(err);
    }
  }
});

socket.on('streamEnd', async payload => {
  if (payload && payload.stream) {
    try {
      await streamService.endStream(payload.stream);
    } catch (err) {
      console.log(err);
    }
  }
});

const express = require('express');
const app = express();
const port = 80;

const graphql = require('./graphQL');

app.use(express.json());

app.use(graphql);

app.use('/graphql', function(req, res, next) {
  next();
});

app.listen(port, () =>
  console.log(`Stream service listening on port ${port}.`)
);
