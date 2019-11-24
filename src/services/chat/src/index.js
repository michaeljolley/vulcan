require('dotenv').config();

const io = require('socket.io-client');
const tmi = require('tmi.js');
const chatProcessor = require('./chatProcessor');
const func = require('./func');
const userService = require('./user');

const socket = io.connect(process.env.VULCANHUBURL);

const channelName = process.env.TWITCHCLIENTUSERNAME;
const twitchChatClient = new tmi.Client({
  options: { debug: true },
  connections: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: process.env.TWITCHBOTUSERNAME,
    password: `oauth:${process.env.TWITCHBOTTOKEN}`
  },
  channels: [channelName]
});

// Load available functions by calling the stream function
// that provides the dictionary of available commands
let chatCommands = [
  {
    uri: 'https://vulcan-chat.azurewebsites.net/api/Blog',
    command: 'blog'
  },
  {
    uri: 'https://vulcan-chat.azurewebsites.net/api/Discord',
    command: 'discord'
  },
  {
    uri: 'https://vulcan-chat.azurewebsites.net/api/Font',
    command: 'font'
  },
  {
    uri: 'https://vulcan-chat.azurewebsites.net/api/GitHub',
    command: 'github'
  },
  {
    uri: 'https://vulcan-chat.azurewebsites.net/api/Help',
    command: 'help'
  },
  {
    uri: 'https://vulcan-chat.azurewebsites.net/api/Heroines',
    command: 'heroines'
  },
  {
    uri: 'https://vulcan-chat.azurewebsites.net/api/Keyboard',
    command: 'keyboard'
  },
  {
    uri: 'https://vulcan-chat.azurewebsites.net/api/Mod',
    command: 'mod'
  },
  {
    uri: 'https://vulcan-chat.azurewebsites.net/api/Profile',
    command: 'profile'
  },
  {
    uri: 'https://vulcan-chat.azurewebsites.net/api/So',
    command: 'so'
  },
  {
    uri: 'https://vulcan-chat.azurewebsites.net/api/Team',
    command: 'team'
  },
  {
    uri: 'https://vulcan-chat.azurewebsites.net/api/Twitter',
    command: 'twitter'
  },
  {
    uri: 'https://vulcan-chat.azurewebsites.net/api/YouTube',
    command: 'youtube'
  }
];

// When we receive a new message to send to chat
// from the Socket.IO hub, send it out.
socket.on('newMessage', payload => {
  if (twitchChatClient.readyState() === 'OPEN') {
    if (payload.messageType === 'chat') {
      twitchChatClient.say(channelName, payload.message);
    }
  }
});

/**
 * On chat message, process appropriate commands and push to
 * SignalR.
 */
twitchChatClient.on('message', async (channel, tags, message, self) => {
  if (self) return;

  // if (chatCommands.length === 0) {
  //   try {
  //     chatCommands = (await func.getAvailableCommands()).data;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  // Get user from user service to send along with payloads
  let user = {};
  try {
    user = (await userService.getUser(tags.username)).data;
  } catch (err) {
    console.log(err);
  }

  let hasCommand = false;

  const firstWord = message.toLowerCase().split(' ');

  // Is this message calling a known command?  If so,
  // submit it to the appropriate function
  const chatCommand = chatCommands.find(f => `!${f.command}` == firstWord);
  if (chatCommand) {
    hasCommand = true;
    try {
      await func.callChatCommand(chatCommand.uri, channel, tags, message, user);
    } catch (err) {
      console.log(err);
    }
  }

  const sanitizedMessage = chatProcessor.processChat(message, tags);

  // Send message to SignalR to be processed by
  // anyone who needs it
  socket.emit('onChatMessage', {
    channel,
    tags,
    message,
    user,
    sanitizedMessage: sanitizedMessage.message,
    hasCommand
  });

  // If emotes were sent in the message, emit them to the hub
  if (sanitizedMessage.emotes.length > 0) {
    socket.emit('onChatMessageWithEmotes', {
      emotes: sanitizedMessage.emotes
    });
  }
});

twitchChatClient.connect();
