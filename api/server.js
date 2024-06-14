const express = require('express');
const server = express();
const usersRouter = require('./users/users-router');
const postsRouter = require('./posts/posts-router');

server.use(express.json());
server.use('/api/users', usersRouter);
server.use('/api/posts', postsRouter);
server.use('/', (req, res) => {
    res.status(200).send('<h1>Users & Posts API.</h1><p>Head to /api/users to get started :)</p>')
})


module.exports = server;