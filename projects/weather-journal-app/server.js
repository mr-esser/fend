// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Express for routing
const express = require('express');
const app = express();

// Body-parser for message parsing
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Setup Server
app.get('/hello', function(req, res) {
  res.send('Hello user :-)');
});

const port = 3030;
app.listen(port, function() {
  console.log(`Weather journal app is listening on port ${port}!`);
});
