const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  message: String,
  timestamp: Date,
  user: {
    ref: 'UserInfo',
    type: mongoose.Schema.Types.ObjectId
  }
});

const cheerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserInfo'
  },
  bits: Number
});

const segmentSchema = new mongoose.Schema({
  timestamp: { type: String, required: true },
  topic: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserInfo'
  }
});

const subscriberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserInfo'
  },
  wasGift: { type: Boolean, default: false, required: true },
  cumulativeMonths: { type: Number, default: 1, required: true }
});

const raiderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserInfo'
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

  segments: [segmentSchema],

  moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserInfo' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserInfo' }],
  subscribers: [subscriberSchema],
  raiders: [raiderSchema],
  cheers: [cheerSchema],
  contributors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserInfo' }],
  chatMessages: [chatMessageSchema]
});

const StreamModel = new mongoose.model('Stream', streamSchema);

module.exports = StreamModel;
