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
  saveUser: async function(newUser) {
    const mutation = /* GraphQL */ `
      ($user: UserInput!) {
        createUser(data: $user) {
            login
            _id
        }
      }
    `;

    const variables = {
      user: newUser
    };

    try {
      const data = await client.mutate(mutation, variables);

      if (data.createUser && data.createUser.data) {
        return data.createUser.data[0] || undefined;
      }
    } catch (err) {
      console.log(err);
    }

    return undefined;
  },
  getUser: async function(login) {
    const query = /* GraphQL */ `
      query getUserByLogin($login: String!) {
        usersByLogin(login: $login) {
          data {
            login
            display_name
            profile_image_url
            liveCodersTeamMember
          }
        }
      }
    `;

    const variables = {
      login: login
    };

    try {
      const data = await client.query(query, variables);

      if (data.usersByLogin && data.usersByLogin.data) {
        return data.usersByLogin.data[0] || undefined;
      }
    } catch (err) {
      console.log(err);
    }

    return undefined;
  }
};

module.exports = db;
