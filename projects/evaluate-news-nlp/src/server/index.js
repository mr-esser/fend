require('dotenv').config();
console.log(`Your API key is ${process.env.API_KEY}`);

const fetch = require('node-fetch');

const express = require('express');
const app = express();
app.use(express.static('dist'));
const cors = require('cors');
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

console.debug(__dirname);
app.get('/', function(req, res) {
  // Never gets called actually.
  console.log('::: Get called on "/" :::');
  res.sendFile('dist/index.html');
});

app.post('/test', function(req, res) {
  const apiUrl = new URL('https://api.meaningcloud.com/sentiment-2.1');
  const apiParams = [
    ['key', process.env.API_KEY], ['of', 'json'], ['lang', 'auto'],
    ['url', req.body.url],
  ];
  apiParams.forEach(([key, value]) => apiUrl.searchParams.append(key, value));
  console.debug(`Calling: ${apiUrl}`);

  const apiResponse = fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: {},
  });

  apiResponse.then((data) => data.json())
      .then((json) => {
        const responseSummary = {
          targetUrl: req.body.url,
          polarity: json.score_tag,
          subjectivity: json.subjectivity,
          irony: json.irony,
          confidence: json.confidence,
        };
        console.debug(responseSummary);
        res.status(200).send(responseSummary);
      })
      .catch((err) => `Doh! ${err}`);
  // TODO: Correct error handling (report back to client),e.g.: Out of credits!
  // TODO: Need to call next()?
  // TODO: Make this an async function
});

// designates what port the app will listen to for incoming requests
app.listen(8080, function() {
  console.log('NLP app listening on port 8080!');
});
