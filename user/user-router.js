const helmet = require('helmet');
const bcrypt = require('bcryptjs')
const express = require('express');

const db = require('../database/dbConfig');
const Users = require('./user-model');

const router = express.Router();

router.use(helmet());
router.use(express.json());

// router.get('/', (req, res) => {
//     res.send("It's alive!");
// });

router.post('/register', (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash
  
    Users.add(user)
        .then(saved => {
        res.status(201).json(saved);
        })
        .catch(error => {
        res.status(500).json(error);
        });
});

router.get('/', restricted, (req, res) => {
    Users.find()
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });
  
router.post('/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                res.status(200).json({ message: `Logged In` });
            } else {
                res.status(401).json({ message: 'You Shall Not Pass' });
            }
        })
        .catch(error => {
        res.status(500).json(error);
    });
});
  


function restricted(req, res, next) {
    const { username, password } = req.headers;

    if (username && password) {
        Users.findBy({ username })
            .first()
            .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                next();
            } else {
                res.status(401).json({ message: 'You Shall Not Pass!' });
            }
            })
            .catch(error => {
            res.status(500).json({ message: 'Unexpected error' });
            });
    } else {
        res.status(400).json({ message: 'No credentials provided' });
    }
}


module.exports = router;
  