# Logger Service

The webhook service is runs as a Node.js app in a Docker container. It is created when a stream starts and is destroyed once the stream ends. During that time it is responsible for:

- Monitoring Twitch chat and dispatching commands to appropriate chat functions
- Sending messages via Twitch chat & Twitch whispers

## Environment Variables

| Variable             | Description                                           |
| -------------------- | ----------------------------------------------------- |
| TWITCHCLIENTID       | Twitch API Client Id. Found at https://dev.twitch.tv/ |
| TWITCHCLIENTTOKEN    | OAuth token for the Twitch channel (not the bot)      |
| TWITCHCLIENTUSERNAME | Twitch channel login                                  |
| TWITCHCLIENTUSERID   | Twitch's unique identifier for the channel login      |
| TWITCHBOTUSERNAME    | Twitch bot login                                      |
| TWITCHBOTTOKEN       | OAuth token for the Twitch account used as a bot      |
| STREAMFUNCTIONSURL   | Uri for the stream functions                          |
| VULCANHUBURL         | Uri to reach the socket.io hub service                |

## Release Notes

See [CHANGELOG.md](../../../CHANGELOG.md)

## Contributing

Want to contribute? Check out our [Code of Conduct](../../../CODE_OF_CONDUCT.md) and [Contributing](../../../CONTRIBUTING.md) docs. This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
