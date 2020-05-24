const chatProcessor = require('./chatProcessor');
const func = require('./func');
const userService = require('./user');
const streamService = require('./stream');

// Load available functions by calling the stream function
// that provides the dictionary of available commands
let chatCommands = [];

const tmiHandlers = {
  streamEnd: () => {
    chatCommands = [];
  },
  chat: async (channel, userstate, message, self, socket) => {
    if (self) return;

    const baseChatFunctionUrl = process.env.CHATFUNCTIONSBASEURL;

    if (chatCommands.length === 0) {
      try {
        chatCommands = (await func.getAvailableCommands()).data;
      } catch (err) {
        console.log(err);
      }
    }

    const stream = await getStream();

    // Get user from user service to send along with payloads
    let user = {};
    try {
      user = (await userService.getUser(userstate.username)).data;
    } catch (err) {
      console.log(`Unable to retrieve user: ${userstate.username}`);
    }

    // If this is a moderator, make sure they've been added as a mod
    // for this stream.
    if (userstate.mod && stream && stream.moderators.indexOf(user._id) === -1) {
      socket.emit('onModerator', {
        user,
        stream
      });
    }

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

    if (stream === undefined) return;

    // If this isn't an existing command but starts with "!" send to the
    // sound effect function to see if it should trigger something.
    if (
      !hasCommand &&
      stream &&
      firstWord.charAt(0) === '!' &&
      message.toLowerCase().split(' ').length === 1
    ) {
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

    if (sanitizedMessage.message.length > 0) {
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
    }

    // If emotes were sent in the message, emit them to the hub
    if (sanitizedMessage.emotes.length > 0) {
      socket.emit('onChatMessageWithEmotes', {
        emotes: sanitizedMessage.emotes,
        stream
      });
    }
  },
  cheer: async function(channel, userstate, message, socket) {
    await this.chat(channel, userstate, message, false, socket);

    let user = {};
    try {
      user = (await userService.getUser(userstate.username)).data;
    } catch (err) {
      console.log(err);
    }

    const stream = await getStream();

    if (stream && user) {
      // Send message to Socket.IO to be processed by
      // anyone who needs it
      socket.emit('onCheer', {
        channel,
        userstate,
        message,
        user,
        stream
      });
    }
  },
  giftpaidupgrade: async (channel, username, sender, userstate, socket) => {
    let user = {};
    try {
      user = (await userService.getUser(username)).data;
    } catch (err) {
      console.log(err);
    }

    onAnySub(channel, user, false, '', 1, socket);
  },
  raided: async (channel, username, viewers, socket) => {
    let user = {};
    try {
      user = (await userService.getUser(username)).data;
    } catch (err) {
      console.log(err);
    }

    const stream = await getStream();

    if (stream && user) {
      // Send message to Socket.IO to be processed by
      // anyone who needs it
      socket.emit('onRaid', {
        channel,
        viewers,
        user,
        stream
      });
    }
  },
  resub: async (
    channel,
    username,
    cumulativeMonths,
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

    onAnySub(channel, user, false, message, cumulativeMonths, socket);
  },
  subgift: async (
    channel,
    username,
    cumulativeMonths,
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

    onAnySub(channel, user, true, '', cumulativeMonths, socket);
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

    onAnySub(channel, user, true, '', 1, socket);
  },
  subscription: async (
    channel,
    username,
    cumulativeMonths,
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

    onAnySub(channel, user, false, message, cumulativeMonths, socket);
  },
  join: async (channel, username, self, socket) => {
    let user = {};
    try {
      user = (await userService.getUser(username)).data;
    } catch (err) {
      console.log(`Unable to retrieve user: ${username}`);
    }

    const stream = await getStream();

    if (stream && user) {
      // Send message to Socket.IO to be processed by
      // anyone who needs it
      socket.emit('onJoin', {
        channel,
        user,
        stream
      });
    }
  },
  part: async (channel, username, self, socket) => {
    let user = {};
    try {
      user = (await userService.getUser(username)).data;
    } catch (err) {
      console.log(`Unable to retrieve user: ${username}`);
    }

    const stream = await getStream();

    if (stream && user) {
      // Send message to Socket.IO to be processed by
      // anyone who needs it
      socket.emit('onPart', {
        channel,
        user,
        stream
      });
    }
  }
};

const onAnySub = async (
  channel,
  user,
  wasGift,
  message,
  cumulativeMonths,
  socket
) => {
  const stream = await getStream();

  if (stream && user) {
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
  }
};

const getStream = async () => {
  let stream = undefined;
  try {
    const streams = await streamService.getActiveStream();

    if (streams && streams.data) {
      if (streams.data.length > 0) {
        stream = streams.data[0];
      } else {
        stream = streams.data;
      }
    }
  } catch (err) {}
  return stream;
};

module.exports = tmiHandlers;
