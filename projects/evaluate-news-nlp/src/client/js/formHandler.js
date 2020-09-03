/* Constants re-used throughout the module */
const STYLE_HIDDEN = 'hidden';
const RESULT_SECTION = 'result';

const ResultDiv = {
  SPINNER: 'spinner',
  GRID: 'result-grid',
  ERROR: 'error-message',
};

// Shorthand helper function
function getElement(id) {
  return document.getElementById(id);
}

function hideElement(id) {
  getElement(id).classList.add(STYLE_HIDDEN);
}

function showElement(id) {
  getElement(id).classList.remove(STYLE_HIDDEN);
}

function showResultDiv(showId) {
  Object.keys(ResultDiv).forEach((key) => {
    const candidateId = ResultDiv[key];
    if (candidateId === showId) {
      showElement(candidateId);
      console.debug('Revealing result div: ' + candidateId);
    } else {
      hideElement(candidateId);
      console.debug('Hiding result div: ' + candidateId);
    }
  });
}

function getSubmittedUrl() {
  const url = getElement('document-url').value;
  console.debug(`Submitted document URL: ${url}`);
  return url;
}

// Wrapper intended to minimize reflows when updating the UI section
function updateResultSection(update) {
  hideElement(RESULT_SECTION);
  update();
  showElement(RESULT_SECTION);
}

async function handleSubmit(event) {
  event.preventDefault();

  updateResultSection(() => {
    showResultDiv(ResultDiv.SPINNER);
  });

  try {
    const response = await fetch('http://localhost:8080/analysis', {
      method: 'POST',
      headers: {
        'Accept': 'application/json;charset=utf-8',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({url: getSubmittedUrl()}),
    });

    const analysisResult = await response.json();

    updateResultSection(() => {
      fillResultGrid(analysisResult);
      showResultDiv(ResultDiv.GRID);
    });
  } catch (error) {
    console.error(error);
    updateResultSection(() => {
      showResultDiv(ResultDiv.ERROR);
    });
  }
}

function fillResultGrid(result) {
  getElement('targetUrl').innerHTML =
  `<a class="text-link" href="${result.targetUrl}">${result.targetUrl}</a>`;
  getElement('polarity').innerHTML = result.polarity;
  getElement('subjectivity').innerHTML = result.subjectivity;
  getElement('irony').innerHTML = result.irony;
  getElement('confidence').innerHTML = `${result.confidence}%`;
}

export {handleSubmit};
