require('dotenv').config();

const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const api = require('./api');
const cache = require('./cache');
const db = require('./db');

/**
 * Retrieves a user based on the provided user login
 * @param {string} login Unique Twitch user login 
 */
async function getUser(login) {
  let user;

  // If it exists, get the user from the cache.
  try {
    user = await cache.getUser(login);
  }
  catch (err) {
    console.log(err);
  }

  if (user) {
    return user;
  }

  // If we didn't get the user from the cache, attempt
  // to get it out of the database.
  try {
    user = await db.getUser(login);
  }
  catch (err) {
    console.log(err);
  }

  // If we got the user from the database, add it to 
  // the cache for future requests and return it.
  if (user) {
    try {
      await cache.storeUser(user);
    }
    catch (err) {
      console.log(err);
    }
    return user;
  }

  // If we didn't have the user in cache or the database,
  // make a call out to the Twitch API to retrieve it.
  try {
    user = await api.getUser(login);
  }
  catch (err) {
    console.log(err);
  }

  // If we received the user from the Twitch API, add it
  // to both the cache and database for future requests.
  if (user) {
    try {
      await cache.storeUser(user);
      await db.saveUser(user);
    }
    catch (err) {
      console.log(err);
    }
    return user;
  }

  return undefined;
}

/**
 * Refreshes the cache & database record for a user based
 * on their Twitch profile
 * @param {string} login Unique Twitch handle for the user 
 */
async function refreshUser(login) {
  let user, refreshedUser;

  // Get the updated user from the Twitch API.
  try {
    refreshedUser = await api.getUser(login);
  }
  catch (err) {
    console.log(err);
  }

  if (refreshedUser) {

    try {
      let dbUser = await db.getUser(login);

      refreshedUser = { ...dbUser, ...refreshedUser };

      user = await db.saveUser(refreshedUser);

      if (user) {
        await cache.storeUser(user);
      }
    }
    catch (err) {
      console.log(err);
    }

    return user;
  }

  return undefined;
}

/**
 * Updates a user record in the cache & database
 * @param {User} user Object representing the user with parameters to change
 */
async function updateUser(login, user) {
  if (!user) return undefined;

  let updatedUser;

  try {
    let dbUser = await db.getUser(login);

    user = { ...dbUser, ...user };

    updatedUser = await db.saveUser(user);

    if (updatedUser) {
      await cache.storeUser(updatedUser);
    }
  }
  catch (err) {
    console.log(err);
  }

  return updatedUser;
}

app.get('/user/:login', async (req, res) => {
  const login = req.params.login.toLocaleLowerCase();

  try {
    const user = await getUser(login);

    if (user) {
      res.json(user);
      return;
    }
  }
  catch (err) {
    console.log(err);
  }

  // If the user couldn't be found in any service, return
  // a 404 (Not Found).
  res.sendStatus(404);
});

app.post('/user/:login', async (req, res) => {
  const login = req.params.login.toLocaleLowerCase();

  if (!req.body) {
    res.sendStatus(500);
    return;
  }

  let user = req.body;

  try {
    let updatedUser = await updateUser(login, user);

    if (updatedUser) {
      res.json(updatedUser);
      return;
    }
  }
  catch (err) {
    console.log(err);
  }

  // If the user couldn't be found in any service, return
  // a 404 (Not Found).
  res.sendStatus(404);
});

/**
 * Refreshes a users info in the database & cache from the Twitch API
 * @param {string} login Unique Twitch user login 
 */
app.get('/refresh/:login', async (req, res) => {
  const login = req.params.login.toLocaleLowerCase();

  try {
    const user = await refreshUser(login);

    if (user) {
      res.json(user);
      return;
    }
  }
  catch (err) {
    console.log(err);
  }

  // If the user couldn't be found in any service, return
  // a 404 (Not Found).
  res.sendStatus(404);
});

app.listen(port, () => console.log(`User service listening on port ${port}.`));