require('dotenv').config();

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
