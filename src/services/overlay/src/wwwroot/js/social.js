'use strict';

/**
 * 0 = Twitter
 * 1 = Twitch
 * 2 = YouTube
 * 3 = GitHub
 * 4 = Instagram
 */
let socialState = 0;
const twitter = document.getElementById('twitter');
const twitch = document.getElementById('twitch');
const youtube = document.getElementById('youtube');
const github = document.getElementById('github');
const instagram = document.getElementById('instagram');
const intro = 'fadeInDown';
const outro = 'fadeOutDown';

function toggleState() {
  reset();

  switch (socialState) {
    case 0:
      twitter.classList.remove(outro);
      twitter.classList.add(intro);
      socialState++;
      break;
    case 1:
      twitch.classList.remove(outro);
      twitch.classList.add(intro);
      socialState++;
      break;
    case 2:
      youtube.classList.remove(outro);
      youtube.classList.add(intro);
      socialState++;
      break;
    case 3:
      github.classList.remove(outro);
      github.classList.add(intro);
      socialState++;
      break;
    case 4:
      instagram.classList.remove(outro);
      instagram.classList.add(intro);
      socialState = 0;
      break;
  }
}

function reset() {
  youtube.classList.remove(intro);
  github.classList.remove(intro);
  twitter.classList.remove(intro);
  twitch.classList.remove(intro);
  instagram.classList.remove(intro);
  youtube.classList.add(outro);
  github.classList.add(outro);
  twitter.classList.add(outro);
  twitch.classList.add(outro);
  instagram.classList.add(outro);
}

toggleState();

setInterval(() => {
  toggleState();
}, 20000);
