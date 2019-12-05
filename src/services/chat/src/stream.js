const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;

require('dotenv').config();

const transport = new Transport('http://stream/graphql');

const client = new Lokka({
  transport: transport
});

const streamService = {
  /**
   * Returns the active stream or undefined
   */
  getActiveStream: async function() {
    const query = /* GraphQL */ `
      query getStreamsByStreamDate($streamDate: String!) {
        streamsByStreamDate(streamDate: $streamDate) {
          data {
            _id
            id
          }
        }
      }
    `;

    const variables = {
      streamDate: formatDate(new Date())
    };

    try {
      return await client.query(query, variables);
    } catch (err) {
      console.log(err);
    }

    return undefined;
  }
};

module.exports = streamService;

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('/');
}
