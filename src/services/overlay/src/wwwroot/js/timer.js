'use strict';

let interval;
let secondsRemaining = 0;
let totalSeconds = 0;
let showLabelTimer = 0;
let currentTimer;

const messageBody = document.getElementById('messageBody');
const percentBar = document.getElementById('timer');
const timeBar = document.getElementById('timeBar');

fetch('/socketio')
  .then(response => {
    return response.json();
  })
  .then(payload => {
    const socket = io.connect(payload.socketIOUrl);

    socket.on('onTimerStart', newTimerEventArg => {
      /* 
       * newTimerEventArg = {
       *  length: length of timer in milliseconds
       *  goal: definition of what the timer is for (what are we timing)
       *  
       * }
      */

      startTimer(newTimerEventArg);
    });
  });

const startTimer = (timer) => {
  stopTimer();

  secondsRemaining = Math.floor(timer.length / 1000);
  totalSeconds = secondsRemaining;
  currentTimer = timer;
  
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = Math.floor(secondsRemaining % 60);

  messageBody.innerText = `${minutes}:${(seconds < 10 ? '0' : '') + seconds}`;
  
  timeBar.classList.remove('hidden');

  // Animate making the timer bar the full width of the page.
  for (let i = 0; i !== 100; i++) {
    percentBar.style.width = `${i}%`;
  }

  interval = setInterval(processSecond, 1000);
}
const stopTimer = () => {
  clearInterval(interval);

  secondsRemaining = 0;
  totalSeconds = 0;
  showLabelTimer = 0;
  currentTimer = undefined;

  timeBar.classList.add('hidden'); 
}

const processSecond = () => {
  secondsRemaining--;

  if (secondsRemaining === 0) {
    stopTimer();
    return;
  }

  const percent = Math.floor((secondsRemaining / totalSeconds) * 100);

  if (secondsRemaining % 30 === 0) {
    showLabelTimer = 10;
  }
  else if (showLabelTimer > 0) {
    showLabelTimer--;
  }

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = Math.floor(secondsRemaining % 60);

  let message = `${minutes}:${(seconds < 10 ? '0' : '') + seconds}`;

  if (showLabelTimer > 0) {
    message = currentTimer.goal;
  }

  messageBody.innerText = message;
  percentBar.style.width = `${percent}%`;
}
