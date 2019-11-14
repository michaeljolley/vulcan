const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;

require('dotenv').config();

const faunaEndpoint = process.env.FAUNADB_ENDPOINT;
const faunaSecret = process.env.FAUNADB_SECRET;

const headers = {
  Authorization: `Bearer ${faunaSecret}`
};
const transport = new Transport(faunaEndpoint, { headers });

// Validate the format of the fields query.
const validFields = (fields = []) => {
  for (let i = 0; i < fields.length; i++) {
    switch (typeof fields[i]) {
      case 'object':
        if (Object.keys(fields[i]).length !== 1) {
          return false;
        } else {
          for (const key in fields[i]) {
            if (!Array.isArray(fields[i][key])) {
              valid = false;
            } else {
              const valid = validFields(fields[i][key]);
              if (!valid) {
                return false;
              }
            }
          }
        }
        break;
      case 'string':
        if (!fields[i].length) {
          return false;
        }
        break;
      default:
        return false;
    }
  }

  return true;
};

// Recursively parse a query
const parseFields = (fields = []) => {
  let output = '';

  for (let i = 0; i < fields.length; i++) {
    switch (typeof fields[i]) {
      case 'object':
        for (const key in fields[i]) {
          output += `${key} {\n`;
          output += `${parseFields(fields[i][key])}`;
          output += '}\n';
        }
        break;
      default:
        output += `${fields[i]}\n`;
    }
  }

  return output;
};

const client = new Lokka({
  transport: transport
});

const db = {
  getStream: async function(streamDate, ...fields) {
    const query = /* GraphQL */ `
      query getStreamByStreamDate($streamDate: String!) {
        streamsByStreamDate(streamDate: $streamDate) {
          data {
            ${parseFields(fields)}
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
  },
  updateStream: async function(newStream) {
    const mutation = /* GraphQL */ `
      ($stream: StreamInput!) {
        createStream(data: $stream) {
            streamDate
            title
        }
      }
    `;

    const variables = {
      stream: newStream
    };

    try {
      const data = await client.mutate(mutation, variables);

      if (data.createStream && data.createStream.data) {
        return data.createStream.data[0] || undefined;
      }
    } catch (err) {
      console.log(err);
    }

    return undefined;
  }
};

module.exports = db;
