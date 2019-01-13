const express = require('express');
const router = express.Router();
const tagDb = require('../data/helpers/tagDb');

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tags = await tagDb.get(id);
    tags.length === 0
      ? res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist.' })
      : res.status(200).json(tags);
  } catch (error) {
    res.status(400).json({
      errorMessage: 'Unable to get the tag information.'
    });
  }
});

module.exports = router;
