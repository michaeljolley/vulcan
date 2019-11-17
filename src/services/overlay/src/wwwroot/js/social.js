"use strict";

/**
 * 0 = Twitter
 * 1 = GitHub
 * 2 = Twitch
 */
let socialState = 0;
const github = document.getElementById('github');
const twitter = document.getElementById('twitter');
const twitch = document.getElementById('twitch');
const intro = 'fadeInDown';
const outro = 'fadeOutDown';

function toggleState() {
    switch (socialState) {
        case 0:
            twitter.classList.remove(outro);
            twitch.classList.remove(intro);
            twitch.classList.add(outro);
            twitter.classList.add(intro);
            socialState++;
            break;
        case 1:
            github.classList.remove(outro);
            twitter.classList.remove(intro);
            twitter.classList.add(outro);
            github.classList.add(intro);
            socialState++;
            break;
        case 2:
            twitch.classList.remove(outro);
            github.classList.remove(intro);
            github.classList.add(outro);
            twitch.classList.add(intro);
            socialState = 0;
            break;
    }
}

toggleState();

setInterval(() => {
    toggleState();
}, 20000);
