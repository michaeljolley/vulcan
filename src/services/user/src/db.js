const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  broadcaster_type: String,
  comicAvatar: String,
  display_name: String,
  githubHandle: String,
  id: { type: String, required: true, index: true },
  lastUpdated: String,
  liveCodersTeamMember: Boolean,
  login: { type: String, index: true },
  profile_image_url: String,
  twitterHandle: String,
  raidAlert: String
});

const UserModel = new mongoose.model('User', userSchema);

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
  saveUser: async function(newUser) {
    return await new Promise(resolve => {
      UserModel.findOneAndUpdate(
        { login: newUser.login },
        newUser,
        { upsert: true, new: true },
        (err, res) => {
          if (err) {
            resolve(undefined);
          }
          resolve(res);
        }
      );
    });
  },
  getUser: async function(login) {
    login = login.toLocaleLowerCase();
    return await new Promise(resolve =>
      UserModel.findOne({ login: login }, (err, res) => {
        if (err) {
          resolve(undefined);
        }
        resolve(res);
      })
    );
  }
};

module.exports = db;
