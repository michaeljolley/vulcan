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
  getWebhooksByEvent: async function(event) {
    const query = /* GraphQL */ `
      query getWebhooksByEvent($event: String!) {
        webhooksByEvent(event: $event) {
          data {
            uri
          }
        }
      }
    `;

    const variables = {
      event: event
    };

    try {
      const data = await client.query(query, variables);

      if (data.webhooksByEvent && data.webhooksByEvent.data) {
        return data.webhooksByEvent.data;
      }
    } catch (err) {
      console.log(err);
    }

    return [];
  }
};

module.exports = db;
