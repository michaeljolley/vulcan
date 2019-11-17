"use strict";

const socket = io('http://localhost:5060');

socket.on('FollowerCountChanged', (followerCountEventArg) => {
    var counter = document.getElementById('followerCounter');
    counter.innerText = followerCountEventArg.followers;
});

// socket.on('ViewerCountChanged', (viewerCountEventArg) => {
//     var counter = document.getElementById('viewerCounter');
//     counter.innerText = viewerCountEventArg.viewers;
// });

let showFollowers = false;
const viewers = document.getElementById('viewers');
const followers = document.getElementById('followers');
const intro = 'fadeInDown';
const outro = 'fadeOutDown';

// function toggleState() {
//     if (showFollowers) {
//         followers.classList.remove(outro);
//         viewers.classList.remove(intro);
//         viewers.classList.add(outro);
//         followers.classList.add(intro);
//     }
//     else {
//         viewers.classList.remove(outro);
//         followers.classList.remove(intro);
//         followers.classList.add(outro);
//         viewers.classList.add(intro);
//     }
//     showFollowers = !showFollowers;
// }

// toggleState();

// setInterval(() => {
//     toggleState();
// }, 20000);
