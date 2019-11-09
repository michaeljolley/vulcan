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
        "Mike's blog and our stream notes can be found at https://michaeljolley.com";

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
