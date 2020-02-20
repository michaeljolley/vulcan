# How to add chat command to the VULCAN chatbot

## Steps (TL; DR)

- [How to add chat command to the VULCAN chatbot](#how-to-add-chat-command-to-the-vulcan-chatbot)
  - [Steps (TL; DR)](#steps-tl-dr)
  - [Changes Required](#changes-required)
    - [Adding a command](#adding-a-command)
    - [Adding the command to the help command](#adding-the-command-to-the-help-command)
    - [Adding the command to the tmiHandler](#adding-the-command-to-the-tmihandler)

## Changes Required

### Adding a command

The easiest way to start making a chat command that responds with text, is to find one that is already created and copy it!

Look in `/src/functions/chat`, and we're going to copy the `Giving` command, right click the folder and paste again to create a clone of the folder and its contents.

Now that you have a `Giving copy` folder, rename it to what your command wants to be.

In the new folder, open the `index.js` file, and change the message in the `const message` block

```javascript
  const message =
    "The Bald Bearded Builder is currently supporting Backpack Buddies, helping feed underprivileged children who don't know where their next meal comes from. More information about the charity can be found at http://stclairbuddies.org";
```

### Adding the command to the help command

Add the name of the command into the message in `/src/functions/chat/Help/index.js` so that it will show up when a chat user sends the `!help` command

### Adding the command to the tmiHandler

Lastly, we need to add how to call the function, into tmiHandlers.js, which is located at `src/services/chat/src/tmiHandlers.js`, copy the below, and change the last part of the URI path and the command to match.

```javascript
{
  uri: 'https://vulcanfunc.azurewebsites.net/api/Giving',
  command: 'giving'
}
```