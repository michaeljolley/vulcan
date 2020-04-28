'use strict';

let amount = 0;
let goal = 120;
let timer;

$(document).ready(() => {
  $('#message').addClass(hidden);
});

fetch('/socketio')
  .then(response => {
    return response.json();
  })
  .then(payload => {
    const socket = io.connect(payload.socketIOUrl);

    socket.on('onCheer', newCheerEventArg => {
      const gained =
        Math.round(
          (newCheerEventArg.userstate.bits / 100 + Number.EPSILON) * 100
        ) / 100;
      amount += gained;
      reCalc();
    });

    socket.on('onSubscription', newSubscriptionEventArg => {
      amount += 2.5;
      reCalc();
    });
  });

const intro = 'bounceInLeft';
const outro = 'bounceOutLeft';
const hidden = 'hid';

const messageObj = document.getElementById('message');
const userObj = $('.user');
const messageBody = document.getElementById('messageBody');
const profileImg = document.getElementById('profileImageUrl');

function reCalc() {
  messageObj.classList.remove(hidden);
  messageObj.classList.remove(outro);

  clearClasses();

  const percent = Math.floor((amount / goal) * 100);

  let message = ``;

  const buddies = Math.floor(amount / 4);

  if (amount >= goal) {
    message = `Amazing! Your generosity has fed ${buddies} kids today. !giving`;
    userObj.addClass('purple');
  } else if (percent >= 70) {
    message = `Uh oh... we've fed ${buddies} kids. I feel a stank a coming. !giving`;
    userObj.addClass('red');
  } else if (buddies > 1) {
    message = `Well done! We've fed ${buddies} kids today. I'm still safe though. !giving`;
  } else {
    message = `All subs/cheers/donations are donated to feed kids. !giving`;
  }

  messageBody.innerHTML = message;

  messageObj.classList.add(intro);

  $('.percent').attr('style', `width:${percent}%`);

  setTimeout(() => {
    messageObj.classList.remove(intro);
    messageObj.classList.add(outro);

    setTimeout(() => {
      messageBody.innerHTML = '';
    }, 1000);
  }, 20000);

  timer = setTimeout(() => {
    reCalc();
  }, 720000);
}

function clearClasses() {
  userObj.removeClass('purple');
  userObj.removeClass('red');
}

$(document).ready(() => {
  timer = setTimeout(() => {
    reCalc();
  }, 180000);
});
