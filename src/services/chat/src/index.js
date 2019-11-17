require('dotenv').config();

const tmi = require('tmi.js');
const func = require('./func');
const userService = require('./user');

const socket = require('socket.io-client')('http://hub:8080');

const channelName = process.env.TWITCH_CLIENT_USERNAME;
const twitchChatClient = new tmi.Client({
  options: { debug: true },
  connections: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: `oauth:${process.env.TWITCH_BOT_TOKEN}`
  },
  channels: [channelName]
});

// Load available functions by calling the stream function
// that provides the dictionary of available commands
let chatCommands = [];

/**
 * On chat message, process appropriate commands and push to
 * SignalR.
 */
twitchChatClient.on('message', async (channel, tags, message, self) => {
  if (self) return;

  if (chatCommands.length === 0) {
    try {
      chatCommands = await func.getAvailableCommands();
    } catch (err) {
      console.log(err);
    }
  }

  // Get user from user service to send along with payloads
  let user = {};
  try {
    user = await userService.getUser(tags.username);
  } catch (err) {
    console.log(err);
  }

  const firstWord = message.toLowerCase().split(' ');

  // Is this message calling a known command?  If so,
  // submit it to the appropriate function
  const chatCommand = chatCommands.find(f => `!${f.command}` === firstWord);
  if (chatCommand) {
    try {
      await func.callChatCommand(chatCommand.uri, channel, tags, message, user);
    } catch (err) {
      console.log(err);
    }
  }

  // Send message to SignalR to be processed by
  // anyone who needs it
  socket.emit('onChatMessage', { channel, tags, message, user });
});

twitchChatClient.connect();

// When we receive a new message to send to chat
// from the Socket.IO hub, send it out.
socket.on('newMessage', message => {
  if (twitchChatClient.readyState === 'OPEN') {
    twitchChatClient.say(channelName, message);
  }
});
