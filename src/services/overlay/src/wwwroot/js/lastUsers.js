"use strict";

const socket = io('http://localhost:5060');

socket.on('LastSubscriberUpdated', (lastUserEventArg) => {
    var profileImg = document.getElementById('subscriberProfileImageUrl');
    var userName = document.getElementById('subscriberDisplayName');
    profileImg.src = lastUserEventArg.userInfo.profile_image_url;
    userName.innerText = lastUserEventArg.userInfo.display_name || lastUserEventArg.userInfo.login;
});

// socket.on('LastFollowerUpdated', (lastUserEventArg) => {
//     var profileImg = document.getElementById('followerProfileImageUrl');
//     var userName = document.getElementById('followerDisplayName');
//     profileImg.src = lastUserEventArg.userInfo.profile_image_url;
//     userName.innerText = lastUserEventArg.userInfo.display_name || lastUserEventArg.userInfo.login;
// });

let showFollower = false;
const follower = document.getElementById('follower');
const subscriber = document.getElementById('subscriber');
const intro = 'fadeInDown';
const outro = 'fadeOutDown';

// function toggleState() {
//     if (showFollower) {
//         follower.classList.remove(outro);
//         subscriber.classList.remove(intro);
//         subscriber.classList.add(outro);
//         follower.classList.add(intro);
//     }
//     else {
//         subscriber.classList.remove(outro);
//         follower.classList.remove(intro);
//         follower.classList.add(outro);
//         subscriber.classList.add(intro);
//     }
//     showFollower = !showFollower;
// }

// toggleState();

// setInterval(() => {
//     toggleState();
// }, 20000);
