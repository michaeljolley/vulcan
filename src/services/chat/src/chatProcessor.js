const sanitizeHtml = require('sanitize-html');

const htmlSanitizeOpts = {
  allowedAttributes: {},
  allowedTags: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'marquee',
    'em',
    'strong',
    'b',
    'i',
    'code',
    'blockquote',
    'strike'
  ]
};

const chatProcessor = {
  processChat: (message, tags) => {
    let tempMessage = sanitizeHtml(message, htmlSanitizeOpts);
    const emotes = [];

    // If the message has emotes, modify message to include img tags to the emote
    if (tags.emotes) {
      let emoteSet = [];

      for (const emote of Object.keys(tags.emotes)) {
        const emoteLocations = tags.emotes[emote];
        emoteLocations.forEach(location => {
          emoteSet.push(generateEmote(emote, location));
        });
      }

      // Order the emotes descending so we can iterate
      // through them with indexes
      emoteSet.sort((a, b) => {
        return b.end - a.end;
      });

      emoteSet.forEach(emote => {
        emotes.push(emote.emoteUrl);

        let emoteMessage = tempMessage.slice(0, emote.start);
        emoteMessage += emote.emoteImageTag;
        emoteMessage += tempMessage.slice(emote.end + 1, tempMessage.length);
        tempMessage = emoteMessage;
      });
    }

    return { message: tempMessage, emotes };
  }
};

module.exports = chatProcessor;

function generateEmote(emoteId, position) {
  const [start, end] = position.split('-').map(Number);

  return {
    emoteId,
    emoteImageTag: `<img class='emote' src='https://static-cdn.jtvnw.net/emoticons/v1/${emoteId}/1.0'/>`,
    emoteUrl: `https://static-cdn.jtvnw.net/emoticons/v1/${emoteId}/1.0`,
    start,
    end
  };
}
