const mongoose = require('mongoose');
const StreamModel = require('./schema/streamSchema');

require('dotenv').config();

const mongoUser = process.env.MONGOUSER;
const mongoPass = process.env.MONGOPASSWORD;
const mongoHost = process.env.MONGOHOST;
const mongoConnectionString = `mongodb://${mongoUser}:${mongoPass}@${mongoHost}:10255/vulcan?ssl=true&retryWrites=true&w=majority`;

mongoose.connect(mongoConnectionString, {
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false
});
const connection = mongoose.connection;
connection.once('once', () => {
  console.log(`Cosmos database connection established successfully`);
});

const db = {
  getStream: async function(streamDateArg) {
    return await new Promise(resolve =>
      StreamModel.findOne({ streamDate: streamDateArg }, (err, res) => {
        if (err) {
          resolve(undefined);
        }
        resolve(res);
      })
    );
  },
  saveStream: async function(stream) {
    return await new Promise(resolve =>
      StreamModel.findOneAndUpdate(
        { streamDate: stream.streamDate },
        stream,
        { upsert: true, new: true },
        (err, res) => {
          if (err) {
            resolve(undefined);
          }
          resolve(res);
        }
      )
    );
  }
};

module.exports = db;
