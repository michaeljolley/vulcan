'use strict';

fetch('/socketio')
  .then(response => {
    return response.json();
  })
  .then(payload => {
    const socket = io.connect(payload.socketIOUrl);

    socket.on('onChatMessage', chatMessageEventArg => {
      console.log(JSON.stringify(chatMessageEventArg));

      if (chatMessageEventArg.hasCommand) {
        return;
      }

      if (
        chatMessageEventArg.sanitizedMessage &&
        chatMessageEventArg.sanitizedMessage.length > 0 &&
        chatMessageEventArg.user &&
        chatMessageEventArg.user.login == 'b3_bot'
      ) {
        return;
      }

      var id = +new Date();

      /*
       * Structure of chat bubble is:
       * chat {vip cheer mod}
       *   timer
       *   body
       *     message
       *     name
       */

      var newChatMessage = createChatDiv('chat');
      newChatMessage.id = 'msg' + id.toString();

      var timer = createChatDiv('timer');
      newChatMessage.appendChild(timer);

      var name = createChatDiv('name');
      name.innerText =
        chatMessageEventArg.user.display_name || chatMessageEventArg.user.login;

      var message = createChatDiv('message');
      message.innerHTML = chatMessageEventArg.sanitizedMessage;

      var body = createChatDiv('body');
      body.appendChild(message);
      body.appendChild(name);

      newChatMessage.appendChild(body);

      var profileImg = document.createElement('img');
      profileImg.src = chatMessageEventArg.user.profile_image_url;
      profileImg.classList.add('profile');
      newChatMessage.appendChild(profileImg);

      /* Add mod styles */
      if (
        chatMessageEventArg.userstate.mod === true ||
        (chatMessageEventArg.userstate.badges &&
          chatMessageEventArg.userstate.badges.broadcaster)
      ) {
        newChatMessage.classList.add('mod');
      }

      /* Add cheer styles */
      if (chatMessageEventArg.userstate.bits > 0) {
        newChatMessage.classList.add('cheer');
      }

      /* Add VIP styles */
      if (
        chatMessageEventArg.userstate.badges &&
        chatMessageEventArg.userstate.badges.vip
      ) {
        newChatMessage.classList.add('vip');
      }

      newChatMessage.style.visibility = 'hidden';
      $('.container').prepend(newChatMessage);

      $('#msg' + id).attr(
        'style',
        `height:${newChatMessage.clientHeight - 58}px`
      );

      animateCSS(newChatMessage, 'bounceInRight', null);
      setTimeout(() => {
        $(timer).animate(
          {
            width: '100%'
          },
          1000
        );
        $(timer).animate(
          {
            width: '0px'
          },
          58000
        );
      }, 1000);

      setTimeout(
        function(id) {
          animateCSS(newChatMessage, 'bounceOutRight', () => {
            $('#msg' + id).remove();
          });
        },
        60000,
        id
      );
    });
  });

function createChatDiv(cssClass) {
  var newDiv = document.createElement('div');
  newDiv.classList.add(cssClass);
  return newDiv;
}

function animateCSS(node, animationName, callback) {
  node.classList.add('animated', animationName);

  function handleAnimationEnd() {
    node.classList.remove('animated', animationName);
    node.removeEventListener('animationend', handleAnimationEnd);

    if (typeof callback === 'function') callback(node);
  }

  node.addEventListener('animationend', handleAnimationEnd);
}

// $(document).ready(() => {
//   $('.chat').attr('style', `height:${newChatMessage.clientHeight - 60}`);
// });
