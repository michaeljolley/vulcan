// const fs = require('fs');
const { buildSchema } = require('graphql');

const schemaFile = '../../../graphQL/schema.gql';

// const data = fs.readFileSync(schemaFile, 'utf8');

export const schema = buildSchema(schemaFile);
