"use strict";

var socket = io('http://localhost:5060');

socket.on('OnCreditsRoll', (streamEventArg) => {

    /* Clear the body tag to ensure we're starting over */
    const body = document.getElementById('bodyYo');
    body.innerText = '';

    /* Build a div.marquee with p and p.header and add to body
    * Moderators = streamEventArg.stream.moderators
    * Followers = streamEventArg.stream.followers
    * Raids = streamEventArg.stream.raiders
    * Subscribers = streamEventArg.stream.subscribers
    * Cheerers = streamEventArg.stream.cheers
    */

    let credits = 0;

    if (streamEventArg &&
        streamEventArg.stream) {

        const stream = streamEventArg.stream;

        const marquee = document.createElement('div');
        marquee.classList.add('marquee');

        const topper = document.createElement('h2');
        topper.innerText = 'Thanks for supporting the stream!';
        marquee.append(topper);

        /* Moderators */
        if (stream.moderators &&
            stream.moderators.length > 0) {
            const modHeader = addParagraph('Moderators', true);
            marquee.append(modHeader);

            credits += stream.moderators.length;

            stream.moderators.forEach(mod => {
                marquee.append(addParagraph(mod.display_name || mod.login, false, mod.profile_image_url));
            });
        }

        /* Subscribers */
        if (stream.subscribers &&
            stream.subscribers.length > 0) {
            const subHeader = addParagraph('Subscribers', true);
            marquee.append(subHeader);

            credits += stream.subscribers.length;

            const tempSubs = [];
            const subscribers = stream.subscribers
                                        .map(m => m.user)
                                        .filter((n) => {
                                            return tempSubs.indexOf(n.id) === -1 &&
                                                    tempSubs.push(n.id);
                                            });

            subscribers.forEach(sub => {
                marquee.append(addParagraph(sub.display_name || sub.login, false, sub.profile_image_url));
            });
        }

        /* Cheerers */
        if (stream.cheers &&
            stream.cheers.length > 0) {
            const subHeader = addParagraph('Cheers', true);
            marquee.append(subHeader);

            credits += stream.cheers.length;

            const tempCheers = [];
            const cheerers = stream.cheers
                                        .map(m => m.user)
                                        .filter((n) => {
                                            return tempCheers.indexOf(n.id) === -1 &&
                                                    tempCheers.push(n.id);
                                            });

            cheerers.forEach(cheer => {
                marquee.append(addParagraph(cheer.display_name || cheer.login, false, cheer.profile_image_url));
            });
        }

        /* Raiders */
        if (stream.raiders &&
            stream.raiders.length > 0) {
            const raiderHeader = addParagraph('Raiders', true);
            marquee.append(raiderHeader);

            credits += stream.raiders.length;

            const tempRaiders = [];
            const raiders = stream.raiders
                                        .map(m => m.user)
                                        .filter((n) => {
                                            return tempRaiders.indexOf(n.id) === -1 &&
                                                    tempRaiders.push(n.id);
                                            });

            raiders.forEach(raider => {
                marquee.append(addParagraph(raider.display_name || raider.login, false, raider.profile_image_url));
            });
        }

        /* Followers */
        if (stream.followers &&
            stream.followers.length > 0) {
            const followHeader = addParagraph('Followers', true);
            marquee.append(followHeader);

            credits += stream.followers.length;

            const tempFollows = [];
            const followers = stream.followers
                                        .filter((n) => {
                                            return tempFollows.indexOf(n.id) === -1 &&
                                                    tempFollows.push(n.id);
                                            });

            followers.forEach(follow => {
                marquee.append(addParagraph(follow.display_name || follow.login, false, follow.profile_image_url));
            });
        }

        /* Contributors */
        if (stream.contributors ||
            stream.candleVotes ||
            stream.segments ||
            stream.notes) {
            const contributorHeader = addParagraph('Contributors', true);
            marquee.append(contributorHeader);

            let contributors = [];

            if (stream.contributors) {
                contributors.push(...stream.contributors);
            }

            if (stream.candleVotes) {
                contributors.push(...stream.candleVotes.map(m => m.user));
            }

            if (stream.segments) {
                contributors.push(...stream.segments.map(m => m.user));
            }

            if (stream.notes) {
                contributors.push(...stream.notes.map(m => m.user));
            }

            if (stream.chatMessages) {
                contributors.push(...stream.chatMessages.map(m => m.user));
            }

            const tempContributors = [];
            contributors = contributors
                                        .filter((n) => {
                                            return tempContributors.indexOf(n.id) === -1 &&
                                                   tempContributors.push(n.id);
                                            });

            credits += contributors.length;

            contributors.forEach(contributor => {
                marquee.append(addParagraph(contributor.display_name || contributor.login, false, contributor.profile_image_url));
            });
        }

        /* Based on credits, modify the css animation attribute for .marquee */
        marquee.setAttribute('style', `animation-duration: ${(credits + 20)}s;`);

        /* Based on how many of the above, change the CSS transition time */
        body.append(marquee);
    }
});

function addParagraph(title, isHeader, profileImageUrl) {
    if (title != 'B3_Bot' &&
        title != 'theMichaelJolley') {
        const p = document.createElement('p');
        if (isHeader) {
            p.classList.add('header');
        }
        if (profileImageUrl) {
            const img = document.createElement('img');
            img.src = profileImageUrl;
            p.append(img);
        }
        const span = document.createElement('span');
        span.innerText = title;
        p.append(span);

        return p;
    }
    return '';
}
