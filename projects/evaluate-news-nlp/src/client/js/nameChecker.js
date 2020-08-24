function checkForName(inputText) {
  console.log('::: Running checkForName :::', inputText);
  const names = ['Picard', 'Janeway', 'Kirk', 'Archer', 'Georgiou'];

  if (names.includes(inputText)) {
    console.log('Welcome, Captain!');
  }
}

function onBlur() {
  console.log('::: Blurring :::');
}

export {checkForName, onBlur};
