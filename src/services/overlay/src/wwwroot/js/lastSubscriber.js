'use strict';

fetch('/socketio')
  .then(response => {
    return response.json();
  })
  .then(payload => {
    const socket = io.connect(payload.socketIOUrl);

    socket.on('LastSubscriberUpdated', lastUserEventArg => {
      var profileImg = document.getElementById('profileImageUrl');
      var userName = document.getElementById('displayName');
      profileImg.src = lastUserEventArg.userInfo.profile_image_url;
      userName.innerText =
        lastUserEventArg.userInfo.display_name ||
        lastUserEventArg.userInfo.login;
    });
  });
