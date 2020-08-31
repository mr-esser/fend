function checkForName(inputText) {
  console.log('::: Running checkForName :::', inputText);
  const names = ['Picard', 'Janeway', 'Kirk', 'Archer', 'Georgiou'];

  if (names.includes(inputText)) {
    console.log('Welcome, Captain!');
  }
}

function onBlur() {
  console.log('::: Blurring :::');
  const name = document.getElementById('name');
  name.addEventListener('input', function(event) {
    if (name.validity.typeMismatch) {
      name.setCustomValidity('I am expecting a URL');
    } else {
      name.setCustomValidity('');
    }
  });
}

export {checkForName, onBlur};
