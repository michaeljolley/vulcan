# User Service

The user service is runs as a Node.js express app in a Docker container. It responds to HTTP endpoints and also listens for Socket.IO events. It is the system of record for user data throughout the system.

## Environment Variables

| Variable          | Description                                           |
| ----------------- | ----------------------------------------------------- |
| FAUNADBENDPOINT   | Endpoint for FaunaDB GraphQL calls                    |
| FAUNADBSECRET     | FaunaDB secret                                        |
| TWITCHCLIENTID    | Twitch API Client Id. Found at https://dev.twitch.tv/ |
| TWITCHCLIENTTOKEN | OAuth token for the Twitch channel (not the bot)      |

## Endpoints

### GET: /user/:login

Returns a user object as JSON from the database based on the provided Twitch login.

Will return a 404 if the user cannot be found.

### POST: /user/:login

Updates the user object in the database and returns the updated user.

Will return a 404 if the user cannot be found.

### GET: /refresh/:login

Updates the Twitch information about a user from the Twitch API

Will return a 404 if the user cannot be found.

## Socket.IO Events

The service listens to the following endpoints and handles appropriately.

### updateUser

Should update a user object with the provided payload.

## Release Notes

See [CHANGELOG.md](../../../CHANGELOG.md)

## Contributing

Want to contribute? Check out our [Code of Conduct](../../../CODE_OF_CONDUCT.md) and [Contributing](../../../CONTRIBUTING.md) docs. This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
