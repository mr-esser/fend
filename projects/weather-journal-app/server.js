// Setup empty JS object to act as endpoint for all routes
projectData = {};

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
// Initialize all route with a callback function
app.get('/hello', function(req, res) {
  res.send('Hello user :-)');
});

// Callback function to complete GET '/all'

// Post Route

/* Spin up the server with an appropriate callback */
const port = 3030;
app.listen(port, function() {
  console.log(`Weather journal app is listening on port ${port}!`);
});
