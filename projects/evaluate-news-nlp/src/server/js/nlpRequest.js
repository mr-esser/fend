require('dotenv').config();
const fetch = require('node-fetch');

const buildNlpRequestUrl = function(documentUrl = '') {
  const url = new URL('https://api.meaningcloud.com/sentiment-2.1');
  url.searchParams.append('key', process.env.API_KEY);
  url.searchParams.append('of', 'json');
  url.searchParams.append('lang', 'auto');
  url.searchParams.append('url', documentUrl);
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

const buildClientResponsePayload = function(analysisResult, targetUrl) {
  const payload = {
    targetUrl: targetUrl,
    polarity: analysisResult.score_tag,
    subjectivity: analysisResult.subjectivity,
    irony: analysisResult.irony,
    confidence: analysisResult.confidence,
  };
  return payload;
};

const runAnalysis = async function(documentUrl) {
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

module.exports = {
  buildNlpRequestUrl: buildNlpRequestUrl,
  fetchNlpAnalysis: fetchNlpAnalysis,
  buildClientResponsePayload: buildClientResponsePayload,
  runAnalysis: runAnalysis,
};
