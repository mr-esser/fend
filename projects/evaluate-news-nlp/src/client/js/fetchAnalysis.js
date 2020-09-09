/* Note(!): 'async' requires special babel plugin and config option to work.
 *           Fetch method is passed in to allow testing in a node-environment
 *           where there is no native fetch implementation available.
 */
async function fetchAnalysisResult(documentUrl = '', serverRoute = 'http://localhost:8080/analysis', fetch = window.fetch) {
  const response = await fetch(serverRoute, {
    method: 'POST',
    headers: {
      'Accept': 'application/json;charset=utf-8',
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({url: documentUrl}),
  });
  if (!response.ok) {
    throw new Error(
        `${response.status}: ${response.statusText}`,
    );
  }
  return response.json();
}

export {fetchAnalysisResult};
