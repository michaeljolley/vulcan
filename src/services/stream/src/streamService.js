const db = require('./db');

const getStreamByStreamDate = async (streamDate) => {
    const query = /* GraphQL */ `
        query getStreamsByStreamDate($streamDate: String!) {
            streamsByStreamDate(streamDate: $streamDate) {
                data {
                    _id
                    id
                }
            }
        }
    `;

  const variables = {
    streamDate: streamDate
  };

  try {
    const data = await db.query(query, variables);

    if (data.streamsByStreamDate && data.streamsByStreamDate.data) {
      return data.streamsByStreamDate.data[0] || undefined;
    }
  } catch (err) {
    console.log(err);
  }

  return undefined;
}

const streamService = {
    saveStream = async (stream) => {
        /*
        * Attempt to get the stream first. If it
        * exists, then perform an update. Otherwise,
        * perform a create.
        */
        let existingStream;

        try {
            existingStream = await getStreamByStreamDate(stream.streamDate)
        } catch (err) {
            console.log(err);
        }

        if (existingStream) {
            const mutation = /* GraphQL */ `
                ($id: ID!, $stream: StreamInput!) {
                    updateStream(id: $id, data: $stream) {    
                        _id
                    }
                }
            `;

            let updatedStream = {
                ...existingStream,
                ...stream
            };
            delete updatedStream._id;

            const variables = {
                id: existingStream._id,
                stream: updatedStream
            };

            try {
                const data = await client.mutate(mutation, variables);

                if (data.updateStream && data.updateStream) {
                return data.updateStream || undefined;
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            const mutation = /* GraphQL */ `
                ($stream: StreamInput!) {
                    createStream(data: $stream) {
                    _id
                    }
                }
            `;

            const variables = {
                stream: stream
            };

            try {
                const data = await client.mutate(mutation, variables);

                if (data.createStream && data.createStream.data) {
                return data.createStream.data[0] || undefined;
                }
            } catch (err) {
                console.log(err);
            }
        }

        return undefined;
    },
    endStream = async (stream) => {
        stream.ended_at = new Date().toISOString();
        await this.saveStream(stream);
    }
};

module.exports = streamService;