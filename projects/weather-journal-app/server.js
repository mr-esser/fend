/* Setup empty JS object to act as endpoint for all routes */
// Will store only the latest project data received from a client.
// This is all the clients will show in their UI, anyway.
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
app.all('*', function(req, res, next) {
  console.log(`${req.method} ${req.path} req:${JSON.stringify(req.body)}`);
  next();
});

// Callback function to complete GET '/all'
app.get('/all', function(req, res) {
  res.json(projectData);
});

// POST route to store an entry
// Note(!): Deliberately not performing any validation here.
// App serves as a general data store. Data validation is
// the client's responsibility.
app.post('/all', function(req, res) {
  projectData = req.body;
  res.status(201).json(projectData);
});

/* Spin up the server with an appropriate callback */
const PORT = 3030;
app.listen(PORT, function() {
  console.log(`Server is listening on port ${PORT}!`);
});
