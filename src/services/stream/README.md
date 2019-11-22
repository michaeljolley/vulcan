# User Service

The user service is runs as a Node.js express app in a Docker container. It responds to HTTP endpoints and also listens for Socket.IO events. It is the system of record for user data throughout the system.

## Environment Variables

| Variable        | Description                                         |
| --------------- | --------------------------------------------------- |
| FAUNADBENDPOINT | The endpoint for the FaunaDB containing stream data |
| FAUNADBSECRET   | The FaunaDB container secret to use on calls        |

## Endpoints

### GET: /stream/:streamDate

Returns a stream object as JSON from the database based on the provided stream date.

Will return a 404 if the stream cannot be found.

## Socket.IO Events

The service listens to the following endpoints and handles appropriately.

## Release Notes

See [CHANGELOG.md](../../../CHANGELOG.md)

## Contributing

Want to contribute? Check out our [Code of Conduct](../../../CODE_OF_CONDUCT.md) and [Contributing](../../../CONTRIBUTING.md) docs. This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
