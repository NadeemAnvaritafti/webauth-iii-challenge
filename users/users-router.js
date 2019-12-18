const router = require('express').Router();
const jwt = require('jsonwebtoken');

const Users = require('./users-model.js');

router.get('/', restrict, (req, res) => {
    Users.find()
    .then(users => {
        res.status(200).json(users);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ errorMessage: 'Failed to retrieve users' });
    })
});


// ------------------ Custom Middleware --------------------- //
function restrict(req, res, next) {
    const { authorization } = req.headers;

    if (authorization) {
        const secret = process.env.JWT_SECRET || "super secret code";

        jwt.verify(authorization, secret, function(err, decodedToken) {
            if (err) {
                res.status(401).json({ message: 'Invalid Token' });
            } else {
                req.token = decodedToken;
                next();
            }
        });
    } else {
        res.status(400).json({ message: 'Please login again' });
    }
};


module.exports = router;