import {fetchAnalysisResult} from './fetchAnalysis';
import {getSubmittedUrl, ResultDiv, updateResultSection,
  showResultDiv, fillResultGrid} from './pageAccess';

// Note(!): 'async' requires special babel plugin and config option to work.
const handleSubmit = async function(event) {
  event.preventDefault();

  try {
    const documentUrl = getSubmittedUrl();
    /* Note(!) Empty url is permitted in the UI so that users
     * do not start their workflow in an error state. */
    if (documentUrl.length === 0) {
    // Avoid follow-up errors on the server and simply return here
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
};

export {handleSubmit};
