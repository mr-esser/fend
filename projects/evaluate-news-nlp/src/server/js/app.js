require('dotenv').config();
const {buildNlpRequestUrl, fetchNlpAnalysis} = require('./nlpRequest');

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

const buildClientResponsePayload = function(analysisResult, targetUrl) {
  const payload = {
    targetUrl: targetUrl,
    polarity: analysisResult.score_tag,
    subjectivity: analysisResult.subjectivity,
    irony: analysisResult.irony,
    confidence: analysisResult.confidence,
  };
  console.debug(payload);
  return payload;
};

const handlePostAnalysis = async function(documentUrl) {
  const requestUrl = buildNlpRequestUrl(documentUrl);
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

  return buildClientResponsePayload(analysisResult, documentUrl);
};

app.post('/analysis', async function(req, res, next) {
  try {
    const responsePayload = await handlePostAnalysis(req.body.url);
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
