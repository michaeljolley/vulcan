"use strict";

const socket = io('http://localhost:5060');

socket.on('FollowerCountChanged', (followerCountEventArg) => {
    var counter = document.getElementById('counter');
    counter.innerText = followerCountEventArg.followers;
});
