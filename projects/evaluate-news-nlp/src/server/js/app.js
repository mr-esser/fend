require('dotenv').config();
const fetch = require('node-fetch');

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
  // Never actually gets called. Does it?
  console.debug('::: Get called on "/" :::');
  res.sendFile('dist/index.html');
});

app.post('/analysis', async function(req, res, next) {
  const buildNlpRequestUrl = function() {
    const url = new URL('https://api.meaningcloud.com/sentiment-2.1');
    url.searchParams.append('key', process.env.API_KEY);
    url.searchParams.append('of', 'json');
    url.searchParams.append('lang', 'auto');
    url.searchParams.append('url', req.body.url);
    return url;
  };

  const fetchNlpAnalysis = async function(requestUrl) {
    console.debug(`Calling: ${requestUrl}`);
    return fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: {},
    });
  };

  const buildClientResponsePayload = function(analysisResult) {
    const payload = {
      targetUrl: req.body.url,
      polarity: analysisResult.score_tag,
      subjectivity: analysisResult.subjectivity,
      irony: analysisResult.irony,
      confidence: analysisResult.confidence,
    };
    console.debug(payload);
    return payload;
  };

  try {
    const requestUrl = buildNlpRequestUrl();
    const serviceResponse = await fetchNlpAnalysis(requestUrl);
    if (!serviceResponse.ok) {
      throw new Error(
          'NLP service responded with HTTP error code' +
          serviceResponse.status,
      );
    }

    const analysisResult = await serviceResponse.json();
    const statusCode = analysisResult.status.code;
    const statusMessage = analysisResult.status.msg;
    if (statusCode != 0 || statusMessage != 'OK') {
      throw new Error(
          `NLP service responded with: ${statusMessage} (${statusCode})`,
      );
    }

    const responsePayload = buildClientResponsePayload(analysisResult);
    res.status(200).send(responsePayload);
  } catch (error) {
    /* Note(!): Must pass error to default handler with next()!
     * Default 500 error is sufficient for the client because
     * it does not need to know about server internals or external APIs.
     * Error will be logged by default. */
    next(error);
  }
});

module.exports = app;
