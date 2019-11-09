// Until we decide we want to use a real cache like Redis, 
// we'll just keep users in an array and look there first.
let userCache = [];

const cache = {
    getUser: function (login) {
        return userCache.find(f => f.login === login);
    },
    storeUser: function (user) {
        userCache = userCache.filter(f => f.login !== login);
        userCache.push(user);
    }
}

module.exports = cache;