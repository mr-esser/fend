require('dotenv').config();
console.log(`Your API key is ${process.env.API_KEY}`);

const express = require('express');
const mockAPIResponse = require('./mockAPI.js');

const app = express();
app.use(express.static('dist'));

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

console.log(__dirname);
app.get('/', function(req, res) {
  // Never gets called actually.
  console.log('::: Get called on "/" :::');
  res.sendFile('dist/index.html');
});

app.get('/test', function(req, res) {
  res.send(mockAPIResponse);
});

// designates what port the app will listen to for incoming requests
app.listen(8080, function() {
  console.log('NLP app listening on port 8080!');
});
