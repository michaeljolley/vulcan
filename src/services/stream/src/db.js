const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;

require('dotenv').config();

const faunaEndpoint = process.env.FAUNADBENDPOINT;
const faunaSecret = process.env.FAUNADBSECRET;

const headers = {
  Authorization: `Bearer ${faunaSecret}`
};
const transport = new Transport(faunaEndpoint, { headers });

const client = new Lokka({
  transport: transport
});

const db = {
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
