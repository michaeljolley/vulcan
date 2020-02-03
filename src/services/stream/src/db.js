const mongoose = require('mongoose');

require('dotenv').config();

const mongoUser = process.env.MONGOUSER;
const mongoPass = process.env.MONGOPASSWORD;
const mongoHost = process.env.MONGOHOST;
const mongoConnectionString = `mongodb+srv://${mongoUser}:${mongoPass}@${mongoHost}/test?retryWrites=true&w=majority`;

mongoose.connect(mongoConnectionString, {
  dbName: 'vulcan',
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true
});

const db = {
  getStream: async function(streamDate) {
    return undefined;
  },
  query: async function(query, variables) {
    try {
      return await client.query(query, variables);
    } catch (err) {
      console.log(err);
    }

    return undefined;
  },
  mutate: async function(mutation, variables) {
    try {
      return await client.mutate(mutation, variables);
    } catch (err) {
      console.log(err);
    }

    return undefined;
  }
};

module.exports = db;
