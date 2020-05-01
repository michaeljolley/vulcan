const io = require("socket.io-client");
const moment = require("moment");
require("dotenv").config();

const socket = io.connect(process.env.VULCANHUBURL);

function formatMomentDuration(duration) {
  let val = duration;

  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();

  const daysString = days > 0 ? `${days} day${days !== 1 ? "s" : ""}` : ``;
  const hoursString =
    hours > 0
      ? `${daysString.length > 0 ? ", " : ""}${hours} hour${
          hours !== 1 ? "s" : ""
        }`
      : ``;
  const minutesString =
    minutes > 0
      ? `
  ${
    daysString.length > 0 || hoursString.length > 0 ? " and " : ""
  }${minutes} minute${minutes !== 1 ? "s" : ""}`
      : ``;

  return `${daysString}${hoursString}${minutesString}`;
}

module.exports = async function (context, req) {
  // All chat functions will receive a payload of:
  // {
  //    channel: string,
  //    userstate: {
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
  //     'message-type'?: "chat" | "action" | "whisper";
  //     username?: string;
  //     bits?: string;
  //    },
  //    message: string,
  //    user: User,
  //    stream: Stream
  // }
  if (req.body && req.body.message && req.body.user && req.body.stream) {
    const user = req.body.user;
    const stream = req.body.stream;

    const username = user.display_name || user.login;

    const startedAt = moment(stream.started_at);
    const now = moment.utc();

    const streamLength = formatMomentDuration(
      moment.duration(now.diff(startedAt))
    );

    const message = `@${username}, we've been streaming for ${streamLength} today. Will the madness never end!?!`;

    const payload = {
      message,
      messageType: "chat", // or 'whisper'
      recipient: null, // required when messageType === whisper
    };

    // Send a message to the Socket.io
    socket.emit("newMessage", payload);
  }
};
