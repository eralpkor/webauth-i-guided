const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const db = require('./database/dbConfig.js');
const Users = require('./users/users-model.js');

// hash password
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("B4c0/\/", salt);

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send("It's alive!");
});

server.post('/api/register', (req, res) => { //
  let user = req.body;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.post('/api/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get('/api/users', (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.get('/hash', (req, res) => {
  // read a password from the Authorization header
  // return an object with the password hashed using bcryptjs
  // { hash: '970(&(:OHKJHIY*HJKH(*^)*&YLKJBLKJGHIUGH(*P' }
  const creds = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash("B4c0/\/", salt, (err, hash) => {
      res.send(201).json(hash)
    })
  })
//   const credentials = req.body;

// const hash = bcrypt.hashSync(credentials.password, 14);

// credentials.password = hash;
})



const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
