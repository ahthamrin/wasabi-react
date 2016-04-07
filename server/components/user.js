module.exports = (app, mydata, socketIO) => {

  var _ = require('lodash');

  var loggedInUsers = mydata.loggedInUsers = {};

  // user store
  var AllUsers = mydata.AllUsers = [
    {
      username: 'alice',
      passwd: 'soi',
      role: 'lecturer'
    },
    {
      username: 'bob',
      passwd: 'soi',
      role: 'student'
    },
    {
      username: 'charlie',
      passwd: 'soi',
      role: 'student'
    },
    {
      username: 'dave',
      passwd: 'soi',
      role: 'student'
    },
    {
      username: 'erin',
      passwd: 'soi',
      role: 'student'
    }
  ];

  var User = mydata.User = {
    login: function(username, passwd) {
        var user = _.find(AllUsers, {username: username, passwd: passwd});
        var loggedInUser = {error: 'No such user or wrong password.'};
        if (user) {
            loggedInUser = _.clone(user);
            loggedInUser.time = new Date();
            delete loggedInUser.passwd;
            loggedInUser.error = '';
        }
        return (loggedInUser);
    },
    logout: function(username) {
        delete username in loggedInUsers;
    }
  }

  socketIO
  .on('connection', function(socket) {
    console.log('connected', socket.id, socket.handshake.session);

    if (socket.handshake.session.user) {
      socket.emit('login', _.pick(socket.handshake.session.user, ['username', 'role', 'error']));
    }

    socket.on('login', function(user) {
      var thisUser = User.login(user.inputUser, user.inputPasswd);
      if (!thisUser.error) {
          loggedInUsers[thisUser.username] = thisUser;
          socket.handshake.session.user = thisUser;
      }
      socket.emit('login', _.pick(thisUser, ['username', 'role', 'error']));
      mydata.db.insertOne({cmd: 'login', user, timestamp: (new Date())});

      console.log('login', user);
    });

    socket.on('logout', function(username) {
      delete socket.handshake.session.user;
      User.logout(username);
    });

    socket.on('update', function(msg) {
      msg.timestamp = (new Date()).toISOString();
      console.log(msg);
      socket.emit('update', msg);
    });
  });

}


