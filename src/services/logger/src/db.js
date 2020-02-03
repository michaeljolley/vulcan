const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;

require('dotenv').config();

const faunaEndpoint = process.env.FAUNADBENDPOINT;
const faunaSecret = process.env.FAUNADBSECRET;

const headers = {
  Authorization: `Bearer ${faunaSecret}`
};
const transport = new Transport(faunaEndpoint, { headers });

const client = new Lokka({
  transport: transport
});

const db = {
  onChatMessage: async payload => {
    const mutation = /* GraphQL */ `
        ($chatMessage: ChatMessageInput!) {
          createChatMessage(data: $chatMessage) {
            _id
          }
        }
      `;

    const variables = {
      chatMessage: {
        timestamp: new Date().toISOString(),
        message: payload.message,
        stream: payload.stream._id | null,
        user: payload.user._id
      }
    };

    try {
      const data = await client.mutate(mutation, variables);
    } catch (err) {
      console.log(err);
    }
  },
  onChatMessageWithEmotes: async payload => {},
  onCheer: async ({ userstate, stream, user }) => {
    const mutation = /* GraphQL */ `
        ($cheer: CheerInput!) {
          createCheer(data: $cheer) {
            _id
          }
        }
      `;

    const variables = {
      cheer: {
        bits: userstate.bits,
        stream: stream._id | null,
        user: user._id
      }
    };

    try {
      const data = await client.mutate(mutation, variables);
    } catch (err) {
      console.log(err);
    }
  },
  onJoin: async payload => {
    if (payload.stream) {
      const mutation = /* GraphQL */ `
        ($viewer: ViewerInput!) {
          createViewer(data: $viewer) {
            _id
          }
        }
      `;

      const variables = {
        viewer: {
          joined: new Date().toISOString(),
          stream: payload.stream._id,
          user: payload.user._id
        }
      };

      try {
        await client.mutate(mutation, variables);
      } catch (err) {
        console.log(err);
      }
    }
  },
  onPart: async payload => {
    if (payload.stream) {
      const viewers = await getViewer(payload.user._id, payload.stream._id);
      const viewer = viewers.find(f => !f.parted);

      if (viewer) {
        const mutation = /* GraphQL */ `
          ($id: ID!, $viewer: ViewerInput!) {
            updateViewer(id: $id, data: $viewer) {
              _id
            }
          }
        `;

        let partedViewer = { ...viewer, parted: new Date().toISOString() };
        delete partedViewer._id;

        const variables = {
          id: viewer._id,
          viewer: partedViewer
        };

        try {
          await client.mutate(mutation, variables);
        } catch (err) {
          console.log(err);
        }
      }
    }
  },
  onRaid: async ({ channel, viewers, user, stream }) => {},
  onSubscription: async ({
    channel,
    user,
    wasGift,
    message,
    cumulativeMonths,
    stream
  }) => {}
};

module.exports = db;

const getViewer = async (userId, streamId) => {
  const query = /* GraphQL */ `
    query getViewersByUserStream($user: ID!, $stream: ID!) {
      viewersByUserStream(streamDate: $user) {
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
};
