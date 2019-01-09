const express = require('express');
const helmet = require('helmet');
// morgan is a logger - it reads the request and gives you info about it
const morgan = require('morgan');

// const gatekeeper = require('../gatekeeper/gatekeeperMiddleware.js');

const server = express();
const userDb = require('../data/helpers/userDb');

// Config middleware
server.use(express.json());
server.use(helmet());
server.use(morgan('dev'));

// server.use(gatekeeper); // using middleware globally. We can also include it before the route handlers (the homies)

// Config endpoints - route handlers are middleware!
server.get('/', (req, res) => {
  res.status(200).json({ api: 'running' });
});

server.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  userDb
    .get(id)
    .then(users => {
      if (users.length === 0) {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' });
      } else {
        res.status(200).json(users);
      }
    })
    .catch(err => {
      res.status(500).json({
        error: 'The post information has not been received.'
      });
    });
});

module.exports = server;
