require('dotenv').config();

const signalR = require('@aspnet/signalr');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const app = express();
const port = 3000;

app.use(express.json());

const schema = require('./schema');
const root = require('./root');

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

app.listen(port, () =>
  console.log(`Stream service listening on port ${port}.`)
);

// Build connection to SignalR service
// const signalRConnection = new signalR.HubConnectionBuilder()
//   .withUrl('/chat')
//   .build();

// /**
//  * When streams need to be updated.  Payload will look like:
//  * {
//  *  stream
//  * }
//  */
// signalRConnection.on('updateStream', async data => {
//   console.log(data);

//   if (data.stream) {
//     try {
//       await updateStream(data.stream.streamDate, data.stream);
//     } catch (err) {
//       console.log(err);
//     }
//   }
// });

// // Connect to SignalR service
// signalRConnection.start();
