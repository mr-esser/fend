// Note(!): 'async' requires special babel plugin and config option to work.
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

export {fetchAnalysisResult};
