const express = require('express');
const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.json('Working!');
});

server.listen(8000, () => console.log('Server is now working!'));
