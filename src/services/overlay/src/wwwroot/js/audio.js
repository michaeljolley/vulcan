'use strict';

const _audioPath = '/assets/audio/clips/';
const container = document.getElementById('container');
const playNext = new CustomEvent('playNext', {
  bubbles: true
});

let avEnabled = true;
let audioQueue = [];

container.addEventListener('playNext', playQueue, false);

fetch('/socketio')
  .then(response => {
    return response.json();
  })
  .then(payload => {
    const socket = io.connect(payload.socketIOUrl);

    socket.on('onSoundEffect', mediaEventArg => {
      if (avEnabled) {
        var audio = document.createElement('audio');
        audio.src = `${_audioPath}${mediaEventArg.audioFile}.mp3`;
        audio.id = +new Date();
        audio.addEventListener('ended', audioStop, false);

        if (container.childElementCount > 0) {
          audioQueue.push(audio);
        } else {
          container.appendChild(audio);
          let playPromise = audio.play().catch(error => {
            throw error;
          });
        }
      }
    });

    socket.on('stopAudio', () => {
      container.innerHTML = '';
      audioQueue = [];
    });

    socket.on('avStateChanged', isEnabled => {
      avEnabled = isEnabled;
    });
  });

function playQueue() {
  if (audioQueue.length > 0) {
    let audio = audioQueue.shift();
    container.appendChild(audio);
    let playPromise = audio.play().catch(error => {
      throw error;
    });
  }
}

function audioStop(e) {
  e.srcElement.dispatchEvent(playNext);
  e.srcElement.remove();
}
