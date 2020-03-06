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

const chatMessageSchema = new mongoose.Schema({
  message: String,
  timestamp: Date,
  user: {
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId
  }
});

const cheerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  bits: Number
});

const subscriberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  wasGift: { type: Boolean, default: false, required: true },
  cumulativeMonths: { type: Number, default: 1, required: true }
});

const raiderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  viewers: Number
});

const streamSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  started_at: { type: String, required: true },
  streamDate: { type: String, required: true },
  ended_at: String,
  title: { type: String, required: true },
  replayLink: String,

  moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  subscribers: [subscriberSchema],
  raiders: [raiderSchema],
  cheers: [cheerSchema],
  contributors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  chatMessages: [chatMessageSchema]
});

const StreamModel = new mongoose.model('Stream', streamSchema);

module.exports = StreamModel;
