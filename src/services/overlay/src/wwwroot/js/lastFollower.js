"use strict";

const socket = io('http://localhost:5060');

socket.on('LastFollowerUpdated', (lastUserEventArg) => {
    var profileImg = document.getElementById('profileImageUrl');
    var userName = document.getElementById('displayName');
    profileImg.src = lastUserEventArg.userInfo.profile_image_url;
    userName.innerText = lastUserEventArg.userInfo.display_name || lastUserEventArg.userInfo.login;
});
