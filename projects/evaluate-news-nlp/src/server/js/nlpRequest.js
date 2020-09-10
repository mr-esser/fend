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

module.exports = {
  buildNlpRequestUrl: buildNlpRequestUrl,
  fetchNlpAnalysis: fetchNlpAnalysis,
};
