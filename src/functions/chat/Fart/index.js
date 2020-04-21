const io = require("socket.io-client");
require("dotenv").config();

const socket = io.connect(process.env.VULCANHUBURL);

module.exports = async function(context, req) {
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

  const message =
    "A well known 'friend' of the stream sent us one of the stinkiest baldbeCandle candles they could find, it was that bad, @BaldBeardedBuilder had to drive home, windows rolled down to clear the smell out of his truck! On his 1 year streamaversary on 19th Jan 2020, he committed that for every 30 kids fed during a stream, via cheers, subs & donations, he will burn the candle live on stream for 15 mins in the name of charity (type !giving for more info, !pobox to find out how to send more candles)! Happy Virtual Candle Sniffing";

  const payload = {
    message,
    messageType: "chat", // or 'whisper'
    recipient: null // required when messageType === whisper
  };

  // Send a message to the Socket.io
  socket.emit("newMessage", payload);
};
