"use strict";

const socket = io('http://localhost:5060');

const emoteQueue = [];
const candleContent = document.getElementById('candleContent');


socket.on('CandleWinner', (candleWinnerEventArg) => {

    console.log(`candleWinner: ${JSON.stringify(candleWinnerEventArg)}`);

    // Display winner
    candleContent.classList.add('done');

    // Remove the chart from the DOM after 15 seconds
    setTimeout(() => {
        animateCSS(candleContent, 'fadeOutDown', clearResults);
    }, 15000);
});

socket.on('CandleVoteUpdate', (candleVoteResultEventArg) => {

    console.log(`candleVoteUpdate: ${JSON.stringify(candleVoteResultEventArg)}`);

    clearResults();

    // Update the chart based on the votes
    const voteResults = candleVoteResultEventArg.voteResults.sort((a, b) => (a.votes < b.votes) ? 1 : -1);

    voteResults.forEach(voteResult => {
        // Find or create new candle div
        const candleDiv = createCandleDiv(voteResult.candle.name);
        const bodyDiv = candleDiv.childNodes[1];

        const voters = voteResult.voters;

        voters.forEach(voter => {
            // Identify voter div or create
            const voterDiv = document.createElement('div');
            const voterImg = document.createElement('img');
            voterDiv.classList.add('voter');
            voterImg.src = voter.profile_image_url;
            voterDiv.append(voterImg);
            bodyDiv.append(voterDiv);
        });
        candleContent.append(candleDiv);
    });
});

socket.on('CandleVoteStart', (streamEventArg) => {

    console.log(`candleStart: ${JSON.stringify(streamEventArg)}`);

    clearResults();
});


function createCandleDiv(name) {
    let newDiv = document.createElement('div');
    newDiv.classList.add('candle');
    newDiv.id = name;

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.innerHTML = name;

    const bodyDiv = document.createElement('div');
    bodyDiv.classList.add('body');

    newDiv.append(titleDiv);
    newDiv.append(bodyDiv);
    return newDiv;
}

function clearResults() {
    candleContent.classList.remove('done');
    candleContent.innerHTML = '';
}

function animateCSS(node, animationName, callback) {
    node.classList.add('animated', animationName)

    function handleAnimationEnd() {
        node.classList.remove('animated', animationName)
        node.removeEventListener('animationend', handleAnimationEnd)

        if (typeof callback === 'function') callback(node)
    }

    node.addEventListener('animationend', handleAnimationEnd)
}
