const CosmosClient = require("@azure/cosmos").CosmosClient;

require('dotenv').config();

const databaseId = process.env.COSMOS_DATABASE;
const containerId = process.env.COSMOS_CONTAINER;
const endpoint = process.env.COSMOS_ENDPOINT_URL;
const key = process.env.COSMOS_KEY;

const cosmosClient = new CosmosClient({ endpoint, key });

const db = {
  saveUser: async function (newUser) {
    const response = await cosmosClient
      .database(databaseId)
      .container(containerId)
      .items.upsert(newUser);

    return response.resource || undefined;
  },
  getUser: async function (login) {
    const querySpec = {
      query: 'SELECT * FROM users u WHERE u.login = @login',
      parameters: [
        {
          name: '@login',
          value: login
        }
      ]
    };

    const result = await cosmosClient
      .database(databaseId)
      .container(containerId)
      .items.query(querySpec)
      .fetchNext();

    if (result && result.resources) {
      return result.resources[0];
    }

    return undefined;
  }
}

module.exports = db;