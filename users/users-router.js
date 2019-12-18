const router = require('express').Router();
const jwt = require('jsonwebtoken');

const Users = require('./users-model.js');

router.get('/', restrict, (req, res) => {
    Users.find()
    .then(users => {
        let specificUsers = [];
        if (req.token.department === 'finance') {
            for (let i=0; i<users.length; i++) {
                if (users[i].department === 'finance') {
                    specificUsers.push(users[i]);
                }
            }
        } else if (req.token.department === 'sales') {
            for (let i=0; i<users.length; i++) {
                if (users[i].department === 'sales') {
                    specificUsers.push(users[i])
                }
            }
        }
        res.status(200).json(specificUsers);
        // res.status(200).json(users);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ errorMessage: 'Failed to retrieve users' });
    })
});



// ------------------ Function to check department of user --------------- //

// function checkDepartment(department) {
//     return function(req, res, next) {
//         if(req.token && department === req.token.department) {
//             next();
//         } else {
//             res.status(403).json({ message: 'There are no users in your department'})
//         }
//     }
// }



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
        res.status(400).json({ message: 'Please login and try again' });
    }
};


module.exports = router;