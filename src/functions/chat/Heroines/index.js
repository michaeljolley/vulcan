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

  // Send a message to the SignalR service
  const message =
    "The Heroines of JavaScript cards are created by Vue Vixens and support their scholarship fund. Lauryn (13) & Layla (10) interview a new heroine every other Sunday.  Check our events to catch the next one.  You can learn more at https://women-in-tech.online/ and https://vuevixens.org";

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
};
