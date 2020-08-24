import {checkForName} from './nameChecker';

function handleSubmit(event) {
  event.preventDefault();
  console.log('::: Form Submitted :::');

  // check what text was put into the form field
  const url = document.getElementById('name').value;
  checkForName(url);
  console.log(`::: URL submitted: ${url}`);

  fetch('http://localhost:8080/test', {
    method: 'POST',
    headers: {
      'Accept': 'application/json;charset=utf-8',
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({url: url}),
  })
      .then((res) => res.json())
      .then(function(res) {
        document.getElementById('results').innerHTML = JSON.stringify(res);
      });
}

export {handleSubmit};
