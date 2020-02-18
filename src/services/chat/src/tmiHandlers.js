const chatProcessor = require('./chatProcessor');
const func = require('./func');
const userService = require('./user');
const streamService = require('./stream');

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
    uri: 'https://vulcan-chat.azurewebsites.net/api/Light',
    command: 'light'
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
    uri: 'https://vulcan-chat.azurewebsites.net/api/Stop',
    command: 'stop'
  },
  {
    uri: 'https://vulcan-chat.azurewebsites.net/api/Giving',
    command: 'giving'
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

const tmiHandlers = {
  chat: async (channel, userstate, message, self, socket) => {
    if (self) return;

    const baseChatFunctionUrl = process.env.CHATFUNCTIONSBASEURL;

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
      user = (await userService.getUser(userstate.login)).data;
    } catch (err) {
      console.log(err);
    }

    const stream = await getStream();

    let hasCommand = false;

    const firstWord = message.toLowerCase().split(' ')[0];

    // Is this message calling a known command?  If so,
    // submit it to the appropriate function
    const chatCommand = chatCommands.find(f => `!${f.command}` == firstWord);
    if (chatCommand) {
      hasCommand = true;
      try {
        await func.callChatCommand(
          chatCommand.uri,
          channel,
          userstate,
          message,
          user,
          stream
        );
      } catch (err) {
        console.log(err);
      }
    }

    // If this isn't an existing command but starts with "!" send to the
    // sound effect function to see if it should trigger something.
    if (!hasCommand && firstWord.charAt(0) === '!') {
      await func.callChatCommand(
        `${baseChatFunctionUrl}xAudioEffects`,
        channel,
        userstate,
        message,
        user,
        stream
      );
    }

    const sanitizedMessage = chatProcessor.processChat(message, userstate);

    // Send message to Socket.IO to be processed by
    // anyone who needs it
    socket.emit('onChatMessage', {
      channel,
      userstate,
      message,
      user,
      sanitizedMessage: sanitizedMessage.message,
      hasCommand,
      stream
    });

    // If emotes were sent in the message, emit them to the hub
    if (sanitizedMessage.emotes.length > 0) {
      socket.emit('onChatMessageWithEmotes', {
        emotes: sanitizedMessage.emotes,
        stream
      });
    }
  },
  cheer: async (channel, userstate, message, socket) => {
    await this.chat(channel, userstate, message, false);

    let user = {};
    try {
      user = (await userService.getUser(userstate.login)).data;
    } catch (err) {
      console.log(err);
    }

    const stream = await getStream();

    // Send message to Socket.IO to be processed by
    // anyone who needs it
    socket.emit('onCheer', {
      channel,
      userstate,
      message,
      user,
      stream
    });
  },
  giftpaidupgrade: async (channel, username, sender, userstate, socket) => {
    let user = {};
    try {
      user = (await userService.getUser(username)).data;
    } catch (err) {
      console.log(err);
    }

    onAnySub(channel, user, false, '', 1);
  },
  raided: async (channel, username, viewers, socket) => {
    let user = {};
    try {
      user = (await userService.getUser(username)).data;
    } catch (err) {
      console.log(err);
    }

    const stream = await getStream();

    // Send message to Socket.IO to be processed by
    // anyone who needs it
    socket.emit('onRaid', {
      channel,
      viewers,
      user,
      stream
    });
  },
  resub: async (
    channel,
    username,
    months,
    message,
    userstate,
    methods,
    socket
  ) => {
    let user = {};
    try {
      user = (await userService.getUser(username)).data;
    } catch (err) {
      console.log(err);
    }

    onAnySub(channel, user, false, message, months);
  },
  subgift: async (
    channel,
    username,
    streakMonths,
    recipient,
    methods,
    userstate,
    socket
  ) => {
    let user = {};
    try {
      user = (await userService.getUser(recipient)).data;
    } catch (err) {
      console.log(err);
    }

    onAnySub(channel, user, true, '', streakMonths);
  },
  submysterygift: async (
    channel,
    username,
    numbOfSubs,
    methods,
    userstate,
    socket
  ) => {
    let user = {};
    try {
      user = (await userService.getUser(username)).data;
    } catch (err) {
      console.log(err);
    }

    onAnySub(channel, user, true, '', 1);
  },
  subscription: async (
    channel,
    username,
    method,
    message,
    userstate,
    socket
  ) => {
    let user = {};
    try {
      user = (await userService.getUser(username)).data;
    } catch (err) {
      console.log(err);
    }

    onAnySub(channel, user, false, message, 1);
  },
  join: async (channel, username, self, socket) => {
    let user = {};
    try {
      user = (await userService.getUser(username)).data;
    } catch (err) {
      console.log(err);
    }

    const stream = await getStream();

    // Send message to Socket.IO to be processed by
    // anyone who needs it
    socket.emit('onJoin', {
      channel,
      user,
      stream
    });
  },
  part: async (channel, username, self, socket) => {
    let user = {};
    try {
      user = (await userService.getUser(username)).data;
    } catch (err) {
      console.log(err);
    }

    const stream = await getStream();

    // Send message to Socket.IO to be processed by
    // anyone who needs it
    socket.emit('onPart', {
      channel,
      user,
      stream
    });
  }
};

const onAnySub = async (channel, user, wasGift, message, cumulativeMonths) => {
  const stream = await getStream();

  // Send message to Socket.IO to be processed by
  // anyone who needs it
  socket.emit('onSubscription', {
    channel,
    user,
    wasGift,
    message,
    cumulativeMonths,
    stream
  });
};

const getStream = async () => {
  let stream = undefined;
  try {
    const streams = await streamService.getActiveStream();
    if (streams && streams.data && streams.data.length > 0) {
      stream = streams.data[0];
    }
  } catch (err) {
    console.log(err);
  }
  return stream;
};

module.exports = tmiHandlers;
