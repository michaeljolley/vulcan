# How to add chat command to the VULCAN chatbot

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
