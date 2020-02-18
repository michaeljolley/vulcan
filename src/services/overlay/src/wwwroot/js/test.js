'use strict';

const streamIdEl = document.getElementById('streamId');
const streamNoteSubmitEl = document.getElementById('streamNoteSubmit');
const creditRollSubmitEl = document.getElementById('creditRollSubmit');

fetch('/socketio')
  .then(response => {
    return response.json();
  })
  .then(payload => {
    const socket = io.connect(payload.socketIOUrl);

    streamNoteSubmitEl.onclick = () => {
      if (streamIdEl.value && streamIdEl.value.length > 0) {
        socket.emit('StreamNoteRebuild', streamIdEl.value);
        console.log(`regen submitted for ${streamIdEl.value}`);
      }
    };

    creditRollSubmitEl.onclick = () => {
      if (streamIdEl.value && streamIdEl.value.length > 0) {
        socket.emit('CreditsRoll', streamIdEl.value);
        console.log(`credit roll submitted for ${streamIdEl.value}`);
      }
    };
  });
