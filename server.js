const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Person = require('./models.js');

const port = process.env.PORT || 3000;

const server = express();

// error status code constants
const STATUS_SERVER_ERROR = 500;
const STATUS_USER_ERROR = 422;

server.use(bodyParser.json());

// Your API will be built out here.
server.get('/users', (req, res) => {
  Person.find({}, (err, people) => {
    if (err) res.status(STATUS_SERVER_ERROR);
    else res.json(people);
  });
});

server.get('/users/:direction', (req, res) => {
  const { direction } = req.params;
  Person.find({}).sort({ firstName: direction }).exec((err, people) => {
    if (err) res.status(STATUS_SERVER_ERROR);
    else res.json(people);
  });
});

server.get('/user-get-friends/:id', (req, res) => {
  const { id } = req.params;
  console.log(id);
  Person.findById(id).select('friends').exec((err, friends) => {
    if (err) res.status(STATUS_USER_ERROR);
    else res.json(friends);
  });
});
server.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { firstName, lastName } = req.body;
  Person.findByIdAndUpdate(id, { firstName, lastName }, { new: true }, (err, person) => {
    if (err) res.status(STATUS_USER_ERROR);
    else res.json(person);
  });
});

mongoose.Promise = global.Promise;
const connect = mongoose.connect('mongodb://localhost/people', {
  useMongoClient: true,
});
/* eslint no-console: 0 */
connect.then(
  () => {
    server.listen(port);
    console.log(`Server Listening on ${port}`);
  },
  () => {
    console.log('\n************************');
    console.log("ERROR: Couldn't connect to MongoDB. Do you have it running?");
    console.log('************************\n');
  },
);
