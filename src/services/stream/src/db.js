const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;

require('dotenv').config();

const faunaEndpoint = process.env.FAUNADB_ENDPOINT;
const faunaSecret = process.env.FAUNADB_SECRET;

const headers = {
  Authorization: `Bearer ${faunaSecret}`
};
const transport = new Transport(faunaEndpoint, { headers });

const client = new Lokka({
  transport: transport
});

const db = {
  getStream: async function(streamDate, fields) {
    const query = /* GraphQL */ `
      query getStreamByStreamDate($streamDate: String!) {
        streamsByStreamDate(streamDate: $streamDate) {
          data {
            fields
          }
        }
      }
    `;

    const variables = {
      streamDate: streamDate
    };

    try {
      const data = await client.query(query, variables);

      if (data.streamsByStreamDate && data.streamsByStreamDate.data) {
        return data.streamsByStreamDate.data[0] || undefined;
      }
    } catch (err) {
      console.log(err);
    }

    return undefined;
  }
};

module.exports = db;
