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

const summarizeNlpAnalysis = function(analysisResult, documentUrl) {
  const payload = {
    targetUrl: documentUrl,
    polarity: analysisResult.score_tag,
    subjectivity: analysisResult.subjectivity,
    irony: analysisResult.irony,
    confidence: analysisResult.confidence,
  };
  return payload;
};

// Functions handed in as arguments to allow easy mocking
const runNlpAnalysis = async function(
    documentUrl,
    buildRequest=buildNlpRequestUrl,
    fetchAnalysis=fetchNlpAnalysis,
    summarize=summarizeNlpAnalysis,
) {
  const requestUrl = buildRequest(documentUrl);
  const serviceResponse = await fetchAnalysis(requestUrl);
  if (!serviceResponse.ok) {
    throw new Error(
        'NLP service responded with HTTP error code' +
          serviceResponse.status,
    );
  }

  const fetchedResult = await serviceResponse.json();
  const statusCode = fetchedResult.status.code;
  const statusMessage = fetchedResult.status.msg;
  if (statusCode != 0 || statusMessage != 'OK') {
    throw new Error(
        `NLP service responded with: ${statusMessage} (${statusCode})`,
    );
  }

  return summarize(fetchedResult, documentUrl);
};

module.exports = {
  buildNlpRequestUrl: buildNlpRequestUrl,
  fetchNlpAnalysis: fetchNlpAnalysis,
  summarizeNlpAnalysis: summarizeNlpAnalysis,
  runNlpAnalysis: runNlpAnalysis,
};
