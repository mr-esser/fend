import {checkForName} from './nameChecker';

function handleSubmit(event) {
  event.preventDefault();
  console.log('::: Form Submitted :::');

  // check what text was put into the form field
  const url = document.getElementById('name').value;
  checkForName(url);
  console.log(`::: URL submitted: ${url}`);

  // TODO: This can be a real constant set on load!
  const resultsDiv = document.getElementById('results');
  resultsDiv.style = 'display: none;';
  fetch('http://localhost:8080/test', {
    method: 'POST',
    headers: {
      'Accept': 'application/json;charset=utf-8',
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({url: url}),
  })
      .then((res) => res.json())
      .then((resultObj) =>
        updateUI(resultsDiv, resultObj));
}

function updateUI(containerDiv, result) {
  const divUrl = containerDiv.querySelector('#targetUrl');
  divUrl.innerHTML = `<a href="${result.targetUrl}">${result.targetUrl}</a>`;
  const divPolarity = containerDiv.querySelector('#polarity');
  divPolarity.innerHTML = result.polarity;
  const divSubjectivity = containerDiv.querySelector('#subjectivity');
  divSubjectivity.innerHTML = result.subjectivity;
  const divIrony = containerDiv.querySelector('#irony');
  divIrony.innerHTML = result.irony;
  const divConfidence = containerDiv.querySelector('#confidence');
  divConfidence.innerHTML = result.confidence + '%';
  containerDiv.style = '';
}

export {handleSubmit};
