"use strict";

const socket = io('http://localhost:5060');
const _audioPath = '/assets/audio/clips/';
const container = document.getElementById('container');
const playNext = new CustomEvent('playNext', {
  bubbles: true
});

let avEnabled = true;
let audioQueue = [];

container.addEventListener('playNext', playQueue, false);

socket.on('PlayAudio', (mediaEventArg) => {
    if (avEnabled) {
        var audio = document.createElement('audio');
        audio.src = `${_audioPath}${mediaEventArg.clipName}.mp3`;
        audio.id = +(new Date());
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

socket.on('StopAudio', () => {
    container.innerHTML = '';
    audioQueue = [];
});

socket.on('avStateChanged', (isEnabled) => {
    avEnabled = isEnabled;
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
