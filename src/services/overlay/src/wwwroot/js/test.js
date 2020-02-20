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

    creditRollSubmitEl.onclick = () => {
      if (streamIdEl.value && streamIdEl.value.length > 0) {
        socket.emit('onCreditRoll', streamIdEl.value);
        console.log(`credit roll submitted for ${streamIdEl.value}`);
      }
    };
  });
