"use strict";

const socket = io('http://localhost:5060');

socket.on('ViewerCountChanged', (viewerCountEventArg) => {
    var counter = document.getElementById('counter');
    counter.innerText = viewerCountEventArg.viewers;
});
