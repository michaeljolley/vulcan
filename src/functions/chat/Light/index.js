const io = require("socket.io-client");
const convert = require("color-convert");
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

  // We have to have a message to parse in order to change the light.
  if (req.body && req.body.message) {
    const incomingMessage = req.body.message;

    // We need a second command in the message
    const lowerMessage = incomingMessage.toLocaleLowerCase().trim();
    const splitMessage = lowerMessage.split(" ");

    // We must have exactly two parameters '!light' and the color
    if (splitMessage.length === 2) {
      const rawColor = splitMessage[1];
      let colorIdentified = false;

      // Determine if rawColor is a valid color. If
      // so, then send it over to the web hook and
      // announce it in chat.
      let rgb = [0, 0, 0];

      // if this is a hex color, convert it to RGB
      if (validateHex(rawColor)) {
        rgb = convert.hex.rgb(rawColor);
        colorIdentified = true;
      } else {
        const maybeRGB = convert.keyword.rgb(rawColor);
        if (maybeRGB) {
          rgb = maybeRGB;
          colorIdentified = true;
        }
      }

      if (colorIdentified) {
        const lightPayload = {
          r: rgb[0],
          g: rgb[1],
          b: rgb[2]
        };

        const message = `@${username} has changed the lights to ${rawColor}!`;

        const chatPayload = {
          message,
          messageType: "chat", // or 'whisper'
          recipient: null // required when messageType === whisper
        };

        // Send a message to the Socket.io
        socket.emit("lightChanged", lightPayload);
        socket.emit("newMessage", chatPayload);
      }
    }
  }
};

function validateHex(color) {
  return color.match(/^\#?(([0-9a-f]{3}){1,2})$/i);
}
