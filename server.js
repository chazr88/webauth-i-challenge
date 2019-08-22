const express = require('express');

const UserRouter = require('./user/user-router');

const server = express();

server.use(express.json());
server.use('./api/user', UserRouter);

module.exports = server;