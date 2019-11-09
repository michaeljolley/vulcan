module.exports = async function (context, req) {
  // All chat functions will receive a payload of:
  // {
  //    channel: string,
  //    tags: {
  //     badges?: Badges;
  //     color?: string;
  //     "display-name"?: string;
  //     emotes?: { [emoteid: string]: string[] };
  //     id?: string;
  //     mod?: boolean;
  //     turbo?: boolean;
  //     'emotes-raw'?: string;
  //     'badges-raw'?: string;
  //     "room-id"?: string;
  //     subscriber?: boolean;
  //     'user-type'?: "" | "mod" | "global_mod" | "admin" | "staff";
  //     "user-id"?: string;
  //     "tmi-sent-ts"?: string;
  //     flags?: string;
  //     [paramater: string]: any;
  // 'message-type'?: "chat" | "action" | "whisper";
  // username?: string;
  // bits?: string;
  // },
  //    message: string,
  //    user: User
  // }

  const chatRequest = req.body;

  const userInfo = chatRequest.user;

  const lowerMessage = chatRequest.message.toLocaleLowerCase().trim();
  const params = lowerMessage.split(' ');

  if (params.length === 1) {
    const username = userInfo.display_name || userInfo.login;

    // The user only sent !profile so return what we have set for them.
    let message = `Hi @${username}, here's what we know:`;

    if (userInfo.twitterHandle) {
      message = `${message} Your Twitter handle is ${userInfo.twitterHandle}.`;
    }

    if (userInfo.githubHandle) {
      message = `${message} Your GitHub handle is ${userInfo.githubHandle}.`;
    }

    if (userInfo.twitterHandle === undefined &&
      userInfo.githubHandle === undefined) {
      message = `${message} Nothing.  We know nothing. What are you trying to hide?`;
    }

    // Send a message to the SignalR service
    const payload = {
      message,
      messageType: "chat", // or 'whisper'
      recipient: null // required when messageType === whisper
    };

    // Send it
    return {
      target: "newMessage",
      arguments: [
        payload
      ]
    };
  }
  else if (params.length === 3) {

    const secondWord = params[1];

    if (secondWord === 'twitter' | 'github') {

      let newUserData = {
        id: userInfo.id,
        login: userInfo.login
      };

      // Send an event to update your social profiles
      switch (secondWord) {
        case 'twitter':
          newUserData.twitterHandle = params[2];
          break;

        case 'github':
          newUserData.githubHandle = params[2];
          break;
      }

      // Send new user data to the SignalR service
      const payload = {
        user: newUserData
      };

      // Send it
      return {
        target: "updateUser",
        arguments: [
          payload
        ]
      };
    }
  }
};
