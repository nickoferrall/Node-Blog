// const express = require('express');
// const server = express();

// server.use(express.json());

// server.get('/', (req, res) => {
//   res.json('Working!');
// });

// server.listen(8000, () => console.log('Server is now working!'));

const server = require('./api/server.js');

const port = 9000;
server.listen(port, () => console.log(`Api running on ${port}`));
