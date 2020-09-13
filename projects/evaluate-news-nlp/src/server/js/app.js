const {runNlpAnalysis} = require('./nlpRequest');

/* Configure express */
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

app.get('/', function(req, res) {
  // Never actually gets called, unless there is no
  // index.html in dist (static root).
  console.debug('::: Get called on "/" :::');
  res.send('Hello, world!');
});

app.post('/analysis', async function(req, res, next) {
  try {
    const result = await runNlpAnalysis(req.body.url);
    console.debug(result);
    res.status(200).send(result);
  } catch (error) {
    /* Note(!): Must pass error to default handler with next()!
     * Default 500 error is sufficient for the client because
     * it does not need to know about server internals or external APIs.
     * Error will be logged by default. */
    next(error);
  }
});

module.exports = app;
