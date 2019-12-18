// ---- imports 
const express = require('express');
const helmet = require('helmet');

const authRouter = require('../auth/auth-router');
const usersRouter = require('../users/users-router');



// ---- calling express as variable 
const server = express();



// ---- using/calling the imports
server.use(helmet());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);


// ---- test endpoint
server.get('/', (req, res) => {
    res.send("It's alive!");
});

module.exports = server;