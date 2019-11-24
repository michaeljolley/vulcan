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
  saveUser: async function(newUser) {
    /*
     * Attempt to get the user first. If it
     * exists, then perform an update. Otherwise,
     * perform a create.
     */

    let existingUser;

    try {
      existingUser = await this.getUser(newUser.login);
    } catch (err) {
      console.log(err);
    }

    if (existingUser) {
      const mutation = /* GraphQL */ `
          ($id: ID!, $user: UserInput!) {
            updateUser(id: $id, data: $user) {    
              _id
              id
              login
              broadcaster_type
              display_name
              githubHandle
              lastUpdated
              liveCodersTeamMember
              profile_image_url
              twitterHandle
              raidAlert
            }
          }
        `;

      let updatedUser = {
        ...existingUser,
        ...newUser,
        ...{ lastUpdated: new Date().toISOString() }
      };
      delete updatedUser._id;

      const variables = {
        id: existingUser._id,
        user: updatedUser
      };

      try {
        const data = await client.mutate(mutation, variables);

        if (data.updateUser && data.updateUser) {
          return data.updateUser || undefined;
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      const mutation = /* GraphQL */ `
          ($user: UserInput!) {
            createUser(data: $user) {
              _id
              id
              login
              broadcaster_type
              display_name
              githubHandle
              lastUpdated
              liveCodersTeamMember
              profile_image_url
              twitterHandle
              raidAlert
            }
          }
        `;

      const variables = {
        user: { ...newUser, ...{ lastUpdated: new Date().toISOString() } }
      };

      try {
        const data = await client.mutate(mutation, variables);

        if (data.createUser && data.createUser.data) {
          return data.createUser.data[0] || undefined;
        }
      } catch (err) {
        console.log(err);
      }
    }

    return undefined;
  },
  getUser: async function(login) {
    const query = /* GraphQL */ `
      query getUserByLogin($login: String!) {
        usersByLogin(login: $login) {
          data {
            _id
            id
            login
            broadcaster_type
            display_name
            githubHandle
            lastUpdated
            liveCodersTeamMember
            profile_image_url
            twitterHandle
            raidAlert
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
