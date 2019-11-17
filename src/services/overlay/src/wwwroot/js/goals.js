'use strict';

const socket = io('http://localhost:5060');

let goals = [
  { accomplished: false, name: 'this is a new goal' },
  { accomplished: true, name: 'this is another new goal' }
];

socket.on('NewGoal', newGoalEventArg => {
  console.log(`NewGoal: ${JSON.stringify(newGoalEventArg)}`);
  goals.push(newGoalEventArg.streamGoal);
  refreshGoals();
});

socket.on('GoalUpdated', goalUpdatedEventArg => {
  console.log(`GoalUpdated: ${JSON.stringify(goalUpdatedEventArg)}`);
  switch (goalUpdatedEventArg.type) {
    case 'delete':
      goals = goals.filter(f => f.name !== goalUpdatedEventArg.streamGoal.name);
      break;
  }
  refreshGoals();
});

socket.on('StreamStarted', streamEventArg => {
  console.log(`StreamStarted: ${JSON.stringify(streamEventArg)}`);
  // goals = streamEventArg.stream.goals;
});

socket.on('StreamUpdated', streamEventArg => {
  console.log(`StreamUpdated: ${JSON.stringify(streamEventArg)}`);
  //  goals = streamEventArg.stream.goals;
});

function refreshGoals() {
  let timer = 500;

  $('.goalBox').text('');

  for (var i = 0; i < goals.length; i++) {
    createGoal(goals[i]);
  }

  $('.goalMessage').each(function(i, obj) {
    setTimeout(
      function(el) {
        animateCSS(el, 'slideInLeft', null);
        $(el).fadeIn('slow');

        setTimeout(
          function(elem) {
            animateCSS(elem, 'fadeOutLeft', elem => {
              $(elem).remove();
            });
          },
          10000,
          el
        );
      },
      timer,
      $(this)[0]
    );

    timer += 1000;
  });
}

refreshGoals();

function createGoal(goal) {
  const goalMessage = createDiv('goalMessage');
  const body = createDiv('body');
  const bubble = createDiv('bubble');

  if (goal.accomplished) {
    bubble.classList.add('done');
  }

  const msg = createDiv('message');
  msg.innerText = goal.name;
  bubble.appendChild(msg);
  body.appendChild(bubble);
  goalMessage.appendChild(body);
  $('.goalBox')[0].appendChild(goalMessage);
}

function createDiv(cssClass) {
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
