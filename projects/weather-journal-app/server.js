/* Setup empty JS object to act as endpoint for all routes */
// Will store only the latest combined data received from a client.
// This is all the client will show in its UI, anyway.
let projectData = {};

// Express to run server and routes
const express = require('express');
const app = express();

/* Dependencies */
// Body parser as middleware
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

/* Routing */
// Initialize all route with a callback function.
// Used for debugging purposes.
app.all('/all', function(req, res, next) {
  console.log(`${req.method} ${req.path}\n ${JSON.stringify(req.body)}`);
  next();
});

// Callback function to complete GET '/all'
app.get('/all', function(req, res) {
  res.json(projectData);
});

// POST route to store an entry
app.post('/all', function(req, res) {
  projectData = req.body;
  res.status(201).json(projectData);
});

/* Spin up the server with an appropriate callback */
const port = 3030;
app.listen(port, function() {
  console.log(`Server is listening on port ${port}!`);
});
