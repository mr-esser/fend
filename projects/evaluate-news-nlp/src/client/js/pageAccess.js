// Shorthand helper function
const STYLE_HIDDEN = 'hidden';
const RESULT_SECTION = 'result';

const ResultDiv = {
  SPINNER: 'spinner',
  GRID: 'result-grid',
  ERROR: 'error-message',
};

const hideElement = function(document, id) {
  document.getElementById(id).classList.add(STYLE_HIDDEN);
};

const showElement = function(document, id) {
  document.getElementById(id).classList.remove(STYLE_HIDDEN);
};

// Reveal the given div in the results section and hide all siblings
const showResultDiv = function(document, showId) {
  Object.keys(ResultDiv).forEach((key) => {
    const candidateId = ResultDiv[key];
    if (candidateId === showId) {
      showElement(document, candidateId);
      console.debug('Revealing result div: ' + candidateId);
    } else {
      hideElement(document, candidateId);
      console.debug('Hiding result div: ' + candidateId);
    }
  });
};

// Wrapper intended to minimize reflows when updating the UI section
const updateResultSection = function(document, update) {
  hideElement(document, RESULT_SECTION);
  update();
  showElement(document, RESULT_SECTION);
};

const fillResultGrid = function(document, resultData) {
  document.getElementById('targetUrl').innerHTML =
  `<a class="text-link" href="${resultData.targetUrl}">
     ${resultData.targetUrl}
   </a>`;
  document.getElementById('polarity').innerHTML = resultData.polarity;
  document.getElementById('subjectivity').innerHTML = resultData.subjectivity;
  document.getElementById('irony').innerHTML = resultData.irony;
  document.getElementById('confidence').innerHTML = `${resultData.confidence}%`;
};

const getSubmittedUrl = function(document) {
  const url = document.getElementById('document-url').value;
  console.debug(`Submitted document URL: ${url}`);
  return url.trim();
};

export {
  fillResultGrid, getSubmittedUrl,
  updateResultSection, showResultDiv, showElement,
  hideElement, ResultDiv, STYLE_HIDDEN, RESULT_SECTION,
};
