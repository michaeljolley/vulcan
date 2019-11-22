# Chat Functions

Chat functions exist to process commands from Twitch chat. They can perform whatever action necessary
to facilitate processing the request.

Their command is based on their name. For instance, the `GitHub` function will be called when a
user in chat sends the `!github` command.

## Payload

Every function will receive the same payload of data when called. That payload will contain the following properties:

### channel

Channel is a string that represents the channel the chat message was received in.

### message

Message is a string that contains the full message sent in Twitch chat that resulted in this function being called

### user

User is an object with data relating the to user who sent the chat message. The format of this object is maintained in the [User Service](../../services/user/).

### tags

Tags is an object returned from [tmi.js](https://github.com/tmijs/tmi.js) in the [Chat Service](../../services/chat/).

## Environment Variables

| Variable     | Description                            |
| ------------ | -------------------------------------- |
| VULCANHUBURL | Uri to reach the socket.io hub service |

## Release Notes

See [CHANGELOG.md](../../../CHANGELOG.md)

## Contributing

Want to contribute? Check out our [Code of Conduct](../../../CODE_OF_CONDUCT.md) and [Contributing](../../../CONTRIBUTING.md) docs. This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
