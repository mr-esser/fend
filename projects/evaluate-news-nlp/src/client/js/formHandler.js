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

// Reveal the given div in the results section and hide all siblings
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
  return url.trim();
}

// Wrapper intended to minimize reflows when updating the UI section
function updateResultSection(update) {
  hideElement(RESULT_SECTION);
  update();
  showElement(RESULT_SECTION);
}

async function fetchAnalysisResult(documentUrl) {
  const response = await fetch('http://localhost:8080/analysis', {
    method: 'POST',
    headers: {
      'Accept': 'application/json;charset=utf-8',
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({url: documentUrl}),
  });
  if (!response.ok) {
    throw new Error(
        `${response.status}: '${response.statusText}'`,
    );
  }
  return response.json();
}

function fillResultGrid(result) {
  getElement('targetUrl').innerHTML =
  `<a class="text-link" href="${result.targetUrl}">${result.targetUrl}</a>`;
  getElement('polarity').innerHTML = result.polarity;
  getElement('subjectivity').innerHTML = result.subjectivity;
  getElement('irony').innerHTML = result.irony;
  getElement('confidence').innerHTML = `${result.confidence}%`;
}

// Note(!): 'async' requires special babel plugin and config option to work.
async function handleSubmit(event) {
  event.preventDefault();

  try {
    const documentUrl = getSubmittedUrl();
    /* Note(!) Empty url is permitted in the UI so that users
     * do not start their workflow in an error state. */
    if (documentUrl.length === 0) {
    // Avoid follow-up errors on the server and simply return
      return;
    }

    updateResultSection(() => {
      showResultDiv(ResultDiv.SPINNER);
    });

    // Note(!): await is essential here to resolve the promise!
    const analysisResult = await fetchAnalysisResult(documentUrl);

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

export {handleSubmit};
