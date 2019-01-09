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

server.get('/api/users/getposts/:id', (req, res) => {
  const { id } = req.params;
  userDb
    .getUserPosts(id)
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({
        error: 'The post information has not been received.'
      });
    });
});

// server.post('/api/users/post', async (req, res) => {
//   try {
//     const users = req.body;
//     const userInfo = await userDb.insert(users);
//     res.status(201).json(userInfo);
//   } catch (error) {
//     console.log('Error from post', error);
//     res.status(400).json({
//       errorMessage: 'There was an error while saving the post to the database.'
//     });
//   }
// });

server.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  userDb
    .update(id, changes)
    .then(count => {
      res.status(200).json({ message: `${count} has been updated.` });
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: 'The post information could not be modified.' });
    });
});

server.delete('/api/users/:id', (req, res) => {
  userDb
    .remove(req.params.id)
    .then(count => {
      if (count === 0) {
        res.status(404).json({
          message: 'The user with this ID does not exist.'
        });
      } else {
        res.status(200).json({ message: 'The user has been removed.' });
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'This user could not be removed.' });
    });
});

module.exports = server;
