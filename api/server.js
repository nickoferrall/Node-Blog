const express = require('express');
const server = express();

const configureMiddleware = require('../config/middleware');

// Routes
const apiRouter = require('./apiRouter');
const apiTags = require('../routes/apiTags');
const apiUsers = require('../routes/apiUsers');
const apiPosts = require('../routes/apiPosts');

configureMiddleware(server);

server.use('/api', apiRouter);
server.use('/api/tags', apiTags);
server.use('/api/users', apiUsers);
server.use('/api/posts', apiPosts);

module.exports = server;
