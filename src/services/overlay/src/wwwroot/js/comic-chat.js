"use strict";

var socket = io('http://localhost:5060');

socket.on('OnChatMessage', (chatMessageEventArg) => {

    console.log(JSON.stringify(chatMessageEventArg));

    if (chatMessageEventArg.hasCommand) {
        return;
    }

    if (chatMessageEventArg.originalMessage &&
        chatMessageEventArg.originalMessage.length > 0 &&
        chatMessageEventArg.userInfo &&
        chatMessageEventArg.userInfo.login == 'b3_bot') {
            return;
        }

    // split the chatMessageEventArg.message roughly at 80 characters each and for
    // each call createChatMessage(chatMessageEventArg, message)
    const words = chatMessageEventArg.originalMessage.split(' ');
    let tempMessage = '';
    let notFirst = false;

    for (let i = 0; i < words.length; i++) {

        if ((tempMessage + words[i]).length <= 80) {
            tempMessage += (tempMessage.length === 0 ? '' : ' ') + words[i];
        } else {
            tempMessage += '...';

            createChatMessage(chatMessageEventArg, tempMessage);
            if (!notFirst) {
                notFirst = true;
            }
            tempMessage = `...${words[i]}`;
        }
    }

    if (tempMessage.length > 0) {
        createChatMessage(chatMessageEventArg, tempMessage);
    }

});

function replaceEmotes(user, message) {
    let tempMessage = message;

    // If the message has emotes, modify message to include img tags to the emote
    if (user.emotes) {
        let emoteSet = [];

        for (const emote of Object.keys(user.emotes)) {
            const emoteLocations = user.emotes[emote];
            emoteLocations.forEach(location => {
            emoteSet.push(new Emote(emote, location));
            });
        }

        // Order the emotes descending so we can iterate
        // through them with indexes
        emoteSet = emoteSet.sort((a, b) => {
            return b.end - a.end;
        });

        emoteSet.forEach(emote => {
            const emoteArg = {
                emoteUrl: emote.emoteUrl
            };

            let emoteMessage = tempMessage.slice(0, emote.start);
            emoteMessage += emote.emoteImageTag;
            emoteMessage += tempMessage.slice(emote.end + 1, tempMessage.length);
            tempMessage = emoteMessage;
        });
      }

    return tempMessage;
}

function createChatMessage(chatMessageEventArg, message) {

    var strip = document.getElementsByClassName('strip')[0];

    var id = +(new Date());

    /*
    * Structure of chat bubble is:
    * box
    *   cbbl
    *   character-strip
    *     character
    *       character name {tiki}
    *           head
    *           body
    */

    var box = createChatDiv('box');
    var boxStyle = Math.floor(Math.random() * 3) + 1;

    box.classList.add(`box${boxStyle}`);

    box.id = 'msg' + id.toString();

    var bubble = createBubbleDiv(message);
    var characterStrip = createChatDiv('character-strip');

    var character = createCharacter(chatMessageEventArg.userInfo.comicAvatar || 'tiki');

    characterStrip.append(character);

    if (chatMessageEventArg.mentions &&
        chatMessageEventArg.mentions.length > 0) {
        var mentions = chatMessageEventArg.mentions;
        for (let user of mentions) {
            characterStrip.append(createCharacter(user.comicAvatar || 'tiki'));
        }
    }

    box.append(bubble);
    box.append(characterStrip);

    $('#msg' + id).hide();
    strip.append(box);

    animateCSS(box, 'zoomInUp', null);
    calcPositions();

    $('#msg' + id).fadeIn('slow');

    setTimeout(function (id) {
        $('#msg' + id).fadeOut('slow', () => {
            $('#msg' + id).remove();
        });
    }, 50000, id);
}

function createChatDiv(cssClass) {
    var newDiv = document.createElement('div');
    newDiv.classList.add(cssClass);
    return newDiv;
}

function createBubbleDiv(message) {

    var cbbl = createChatDiv('bubble');
    var msg = createChatDiv('message');
    var arrow = createChatDiv('arrow');

    msg.innerHTML = message;

    cbbl.appendChild(msg);
    cbbl.appendChild(arrow);

    return cbbl;
}

function createCharacter(character) {
    var characterDiv = createChatDiv('character');

    var head = createChatDiv('head');
    var headImg = document.createElement('img');
    headImg.src = `/assets/images/characters/${character}/head-${character}.png`;
    head.append(headImg);

    var body = createChatDiv('body');
    var bodyImg = document.createElement('img');
    bodyImg.src = `/assets/images/characters/${character}/body-${character}.png`;
    body.append(bodyImg);

    characterDiv.append(head);
    characterDiv.append(body);

    return characterDiv;
}

function calcPositions() {
    var nextBottom = 0;
    var transparency = 100;

    // Calc bottoms & remove any divs that need
    $($('.box').get().reverse()).each(function (i, el) {
        transparency = (nextBottom / 100) * 7;

        if (transparency > 0 && (1 - (transparency / 100)) < .5) {
            $(el).remove();
        }
        else {
            nextBottom = nextBottom + $(el).height() + 25;
        }
    });

    nextBottom = 0;
    transparency = 100;

    // Iterate through remainder and move/add
    $($('.box').get().reverse()).each(function (i, el) {
        transparency = (nextBottom / 100) * 7;

        animateCSS(el, 'bounce', null);
        $(el).css('bottom', nextBottom).css({ 'opacity': 1 - (transparency / 100) });
        nextBottom = nextBottom + 225;
    });
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
