const express = require('express');
const helmet = require('helmet');
// morgan is a logger - it reads the request and gives you info about it
const morgan = require('morgan');

const configureMiddleware = require('../config/middleware');
const server = express();
const userDb = require('../data/helpers/userDb');
const postDb = require('../data/helpers/postDb');

// Config middleware

configureMiddleware(server);

const upperMiddleware = (req, res, next) => {
  req.body.name = req.body.name.toUpperCase();
  if (req.body.name.length > 128) {
    res.status(422).json({ message: 'The name is too long!' });
  }
  next();
};

// Config endpoints - route handlers are middleware!
server.get('/', (req, res) => {
  res.status(200).json({ api: 'running' });
});

// Users CRUD

server.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const users = await userDb.get(id);
    users === undefined
      ? res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist.' })
      : res.status(200).json(users);
  } catch (error) {
    res.status(400).json({
      errorMessage: 'There user information has not been received.'
    });
  }
});

server.get('/api/users/getposts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const users = await userDb.getUserPosts(id);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      error: 'The user information has not been received.'
    });
  }
});

server.post('/api/users', upperMiddleware, async (req, res) => {
  try {
    const users = req.body;
    const userInfo = await userDb.insert(users);
    res.status(201).json(userInfo);
  } catch (error) {
    res.status(400).json({
      errorMessage: 'There was an error while saving the post to the database.'
    });
  }
});

server.put('/api/users/:id', upperMiddleware, async (req, res) => {
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
        .json({ message: 'The user information could not be modified.' });
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

// Posts CRUD

server.get('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await postDb.get(id);
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({
      errorMessage: 'There post information has not been received.'
    });
  }
});

server.get('/api/posts/gettags/:id', (req, res) => {
  const { id } = req.params;
  postDb
    .getPostTags(id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res.status(500).json({
        error: 'The post information has not been received.'
      });
    });
});

server.post('/api/posts', async (req, res) => {
  try {
    const postId = await postDb.insert(req.body);
    res.status(201).json(postId);
  } catch (error) {
    if (error.errno === 19) {
      res
        .status(200)
        .json({ error: 'You need to include the text and the userId.' });
    } else {
      res.status(400).json({
        errorMessage:
          'There was an error while saving the post to the database.'
      });
    }
  }
});

server.put('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  postDb
    .update(id, changes)
    .then(count => {
      res.status(200).json({ message: `${count} post has been updated.` });
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: 'The user information could not be modified.' });
    });
});

server.delete('/api/posts/:id', (req, res) => {
  postDb.remove(req.params.id).then(count => {
    if (count === 0) {
      res.status(404).json({
        message: 'The user with this id does not exist.'
      });
    } else {
      res.status(200).json({ message: 'The user has been removed.' });
    }
  });
});

module.exports = server;
