const express = require('express');
const router = express.Router();

const userDb = require('../data/helpers/userDb');

const upperMiddleware = (req, res, next) => {
  req.body.name = req.body.name.toUpperCase();
  if (req.body.name.length > 128) {
    res.status(422).json({ message: 'The name is too long!' });
  }
  next();
};

router.get('/', async (req, res) => {
  try {
    const users = await userDb.get();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({
      errorMessage: 'Unable to get users.'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const users = await userDb.getUserPosts(id);
    users === undefined
      ? res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist.' })
      : res.status(200).json(users);
  } catch (error) {
    res.status(400).json({
      errorMessage: 'The user information has not been received.'
    });
  }
});

router.post('/', upperMiddleware, async (req, res) => {
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

router.put('/:id', upperMiddleware, async (req, res) => {
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

router.delete('/:id', (req, res) => {
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

module.exports = router;
