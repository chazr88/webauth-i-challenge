const express = require('express');
const session = require('express-session');
const knexSessionStore = require('connect-session-knex')(session);

const UserRouter = require('./user/user-router');

const sessionOptions = {
    name: 'mycookie',
    secret: 'thisismycookie',
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: false,
      httpOnly: true, 
    },
    resave: false,
    saveUninitalized: false,
  
    store: new knexSessionStore({
      knex: require('./database/dbConfig'),
      tableName: 'sessions',
      sidfieldname: 'sid',
      createtable: true,
      clearTinterval: 1000 * 60 * 60
    })
  };

const server = express();

server.use(express.json());
server.use(session(sessionOptions))
server.use('/api/user', UserRouter);

server.get('/', (req, res) => {
    res.send("It's alive!");
});

module.exports = server;