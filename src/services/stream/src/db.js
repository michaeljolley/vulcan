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
  getFullStream: async function(streamDateArg) {
    return await new Promise(resolve =>
      StreamModel.findOne({ streamDate: streamDateArg })
        .populate('followers')
        .populate('subscribers.user')
        .populate('raiders.user')
        .populate('cheers.user')
        .populate('contributors')
        .populate('moderators')
        .populate('chatMessages.user')
        .exec((err, res) => {
          if (err) {
            console.dir(err);
            resolve(undefined);
          }
          resolve(res);
        })
    );
  },
  saveCheer: async function(streamId, payload) {
    return await new Promise(resolve =>
      StreamModel.updateOne(
        { _id: streamId },
        {
          $push: {
            cheers: {
              user: payload.user,
              bits: payload.userstate.bits
            }
          }
        },
        (err, res) => {
          if (err) {
            resolve(undefined);
          }
          resolve(res);
        }
      )
    );
  },
  saveChat: async function(streamId, payload) {
    return await new Promise(resolve =>
      StreamModel.updateOne(
        { _id: streamId },
        {
          $push: {
            chatMessages: {
              user: payload.user,
              timestamp: new Date().toISOString(),
              message: payload.message
            }
          }
        },
        (err, res) => {
          if (err) {
            resolve(undefined);
          }
          resolve(res);
        }
      )
    );
  },
  saveRaid: async function(streamId, payload) {
    return await new Promise(resolve =>
      StreamModel.updateOne(
        { _id: streamId },
        {
          $push: {
            raiders: {
              user: payload.user,
              viewers: payload.viewers
            }
          }
        },
        (err, res) => {
          if (err) {
            resolve(undefined);
          }
          resolve(res);
        }
      )
    );
  },
  savePollVote: async function(streamId, payload) {
    return await new Promise(resolve =>
      StreamModel.updateOne(
        { _id: streamId },
        {
          $push: {
            polls: {
              votes: {
                user: payload.user,
                choice: payload.choice
              }
            }
          }
        },
        (err, res) => {
          if (err) {
            resolve(undefined);
          }
          resolve(res);
        }
      )
    );
  },
  saveSubscription: async function(streamId, payload) {
    return await new Promise(resolve =>
      StreamModel.updateOne(
        { _id: streamId },
        {
          $push: {
            subscribers: {
              user: payload.user,
              wasGift: payload.wasGift,
              cumulativeMonths: payload.cumulativeMonths
            }
          }
        },
        (err, res) => {
          if (err) {
            resolve(undefined);
          }
          resolve(res);
        }
      )
    );
  },
  saveFollow: async function(streamId, payload) {
    const user = payload.user;
    return await new Promise(resolve =>
      StreamModel.updateOne(
        { _id: streamId },
        { $push: { followers: user } },
        (err, res) => {
          if (err) {
            console.log(err);
            resolve(undefined);
          }
          resolve(res);
        }
      )
    );
  },
  saveStart: async function(payload) {
    return await new Promise(resolve =>
      StreamModel.findOneAndUpdate(
        {
          streamDate: payload.streamDate
        },
        payload,
        {
          upsert: true, // Create the object if it doesn't exist?
          new: true // Should return the newly updated object rather than the original?
        },
        (err, res) => {
          if (err !== undefined) {
            console.dir(err);
            resolve(undefined);
          } else {
            resolve(res);
          }
        }
      )
    );
  },
  saveEnd: async function(streamId, payload) {
    return await new Promise(resolve =>
      StreamModel.findByIdAndUpdate(
        streamId,
        {
          ended_at: new Date().toISOString()
        },
        {
          upsert: false, // Create the object if it doesn't exist?
          new: true // Should return the newly updated object rather than the original?
        },
        (err, res) => {
          if (err) {
            resolve(undefined);
          }
          resolve(res);
        }
      )
    );
  },
  saveUpdate: async function(streamId, payload) {
    return await new Promise(resolve =>
      StreamModel.findByIdAndUpdate(
        streamId,
        {
          title: payload.title,
          replayLink: payload.replayLink
        },
        {
          upsert: false, // Create the object if it doesn't exist?
          new: true // Should return the newly updated object rather than the original?
        },
        (err, res) => {
          if (err) {
            resolve(undefined);
          }
          resolve(res);
        }
      )
    );
  },
  saveContribution: async function(streamId, payload) {
    const user = payload.user;
    return await new Promise(resolve =>
      StreamModel.updateOne(
        { _id: streamId },
        {
          $push: {
            contributors: {
              user
            }
          }
        },
        (err, res) => {
          if (err) {
            resolve(undefined);
          }
          resolve(res);
        }
      )
    );
  },
  saveModerator: async function(streamId, payload) {
    const user = payload.user;
    return await new Promise(resolve =>
      StreamModel.updateOne(
        { _id: streamId },
        {
          $push: {
            moderators: {
              user
            }
          }
        },
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
