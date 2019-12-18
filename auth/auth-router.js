const bcrypt = require("bcryptjs");
const express = require("express");
const jwt = require('jsonwebtoken');
const router = express.Router();


const Users = require("../users/users-model");


router.post('/register', validate, (req, res) => {
    let userData = req.body;
    const hash = bcrypt.hashSync(userData.password, 8);
    userData.password = hash;

    Users.add(userData)
    .then(user => {
        res.status(201).json(user);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ errorMessage: 'Failed to register new user '})
    })
});


router.post('/login', validate, (req, res) => {
    let { username, password } = req.body;
    Users.findBy({ username })
    .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) { 
            const token = signToken(user);  
            res.status(200).json({ 
                message: `${user.username} Logged In!`, 
                token 
            });
        } else {
            res.status(401).json({ message: 'You Shall Not Pass!' });
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ errorMessage: 'Failed to retrieve credentials '});
    })
});


router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(error => {
            if (error) {
                res.status(500).json({ message: 'there was an error logging out' })
            } else {
                res.status(200).json({ message: 'Successfully logged out!' })
            }
        });
    } else {
        res.status(200).end();
    }
});



// ---------- Function for creating and signing token ----------- //

function signToken(user) {
    const payload = {
      username: user.username,
      department: user.department
    };
  
    const secret = process.env.JWT_SECRET || "super secret code";
  
    const options = {
      expiresIn: "1h",
    };
  
    return jwt.sign(payload, secret, options); 
  }



// ----------------------- CUSTOM MIDDLEWARE ------------------------ //

function validate(req, res, next) {
    const data = req.body;
    if (!data) {
        res.status(400).json({ error: 'missing username and password' })
    } else if (!data.username) {
        res.status(400).json({ error: 'missing required username' })
    } else if (!data.password) {
        res.status(400).json({ error: 'missing required password' })
    } else {
        next();
    }
}


module.exports = router;