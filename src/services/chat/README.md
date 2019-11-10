# Chat Service

The chat service is runs as a Node.js app in a Docker container. It is created when a stream starts and is destroyed once the stream ends. During that time it is responsible for:

- Monitoring Twitch chat and dispatching commands to appropriate chat functions
- Sending messages via Twitch chat & Twitch whispers

## Environment Variables

| Variable               | Description                                           |
| ---------------------- | ----------------------------------------------------- |
| TWITCH_CLIENT_ID       | Twitch API Client Id. Found at https://dev.twitch.tv/ |
| TWITCH_CLIENT_TOKEN    | OAuth token for the Twitch channel (not the bot)      |
| TWITCH_CLIENT_USERNAME | Twitch channel login                                  |
| TWITCH_CLIENT_USER_ID  | Twitch's unique identifier for the channel login      |
| TWITCH_BOT_USERNAME    | Twitch bot login                                      |
| TWITCH_BOT_TOKEN       | OAuth token for the Twitch account used as a bot      |
| STREAM_FUNCTIONS_URL   | Uri for the stream functions                          |

## Release Notes

See [CHANGELOG.md](../../../CHANGELOG.md)

## Contributing

Want to contribute? Check out our [Code of Conduct](../../../CODE_OF_CONDUCT.md) and [Contributing](CONTRIBUTING.md) docs. This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
