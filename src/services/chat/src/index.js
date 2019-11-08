require('dotenv').config();

const tmi = require('tmi.js');
const signalR = require("@aspnet/signalr");
const func = require('./func');
const userService = require('./user');

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

// Build connection to SignalR service
const signalRConnection = new signalR.HubConnectionBuilder()
    .withUrl("/chat")
    .build();
    
/**
 * When new messages should be sent.  Payload will look like:
 * {
 *  message,
 *  messageType: "chat", // or 'whisper'
 *  recipient: null // required when messageType === whisper
 * }
 */
signalRConnection.on("newMessage", data => {
  console.log(data);
});

// Connect to SignalR service
signalRConnection.start();


// Load available functions by calling the stream function
// that provides the dictionary of available commands
let chatCommands = [];

try {
  chatCommands = await func.getAvailableCommands();
} catch (err) {
  console.log(err);
}

/**
 * On chat message, process appropriate commands and push to
 * SignalR.
 */
twitchChatClient.on('message', (channel, tags, message, self) => {
  if (self) return;

  // Get user from user service to send along with payloads
  let user = {};
  try {
    user = await userService.getUser(tags.username);
  }
  catch (err) {
    console.log(err);
  }

  const firstWord = message.toLowerCase().split(' ');

  // Is this message calling a known command?  If so, 
  // submit it to the appropriate function
  const chatCommand = chatCommands.find(f => `!${f.command}` === firstWord);
  if (chatCommand) {
    try {
      await func.callChatCommand(chatCommand.uri, channel, tags, message, user);
    }
    catch (err) {
      console.log(err);
    };
  }

  // Send message to SignalR to be processed by 
  // anyone who needs it
  try {
    await signalRConnection.invoke('onChatMessage', {
      channel,
      tags,
      message,
      user
    });
  }
  catch (err) {
    console.log(err);
  };
});

twitchChatClient.connect();
