'use strict';

const socket = io.connect('https://vulcan-hub.azurewebsites.net');

const emoteQueue = [];
const container = $('#container');

socket.on('onChatMessageWithEmotes', ({ emotes }) => {
  if (emotes && emotes.length > 0) {
    for (let i = 0; i < emotes.length; i++) {
      emoteQueue.push(emotes[i]);
    }
  }
});

setInterval(function() {
  triggerEmote();
}, Math.floor(Math.random() * 1100) + 200);

function triggerEmote() {
  if (emoteQueue.length > 0) {
    const emote = emoteQueue[0];
    emoteQueue.splice(0, 1);
    const img = document.createElement('img');
    const id = +new Date();

    img.src = emote;
    img.classList.add('emoji');
    img.id = 'emoji' + id.toString();

    const initialLeft = Math.floor(
      Math.random() * (container.outerWidth() + 1)
    );
    const initialTop = Math.floor(
      Math.random() * (container.outerHeight() + 1)
    );

    $(img).css({ left: initialLeft, top: initialTop });

    container.append(img);
    animateDiv($(img));

    setTimeout(
      function(id) {
        $('#emoji' + id).remove();
      },
      10000,
      id
    );
  }
}

function makeNewPosition($container) {
  // Get viewport dimensions (remove the dimension of the div)
  var h = $container.height() - 50;
  var w = $container.width() - 50;

  var nh = Math.floor(Math.random() * h + 1);
  var nw = Math.floor(Math.random() * w + 1);

  return [nh, nw];
}

function animateDiv($target) {
  var newq = makeNewPosition($target.parent());
  var oldq = $target.offset();
  var speed = calcSpeed([oldq.top, oldq.left], newq);

  $target.animate(
    {
      top: newq[0],
      left: newq[1]
    },
    speed,
    function() {
      animateDiv($target);
    }
  );
}

function calcSpeed(prev, next) {
  var x = Math.abs(prev[1] - next[1]);
  var y = Math.abs(prev[0] - next[0]);

  var greatest = x > y ? x : y;

  var speedModifier = 0.3;

  var speed = Math.ceil(greatest / speedModifier);

  return speed;
}
