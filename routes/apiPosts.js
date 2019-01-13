const express = require('express');
const router = express.Router();
const postDb = require('../data/helpers/postDb');

router.get('/:id', async (req, res) => {
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

router.get('/gettags/:id', (req, res) => {
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

router.post('/', async (req, res) => {
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

router.put('/:id', async (req, res) => {
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

router.delete('/:id', (req, res) => {
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

module.exports = router;
