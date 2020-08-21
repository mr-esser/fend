import {handleSubmit} from './js/formHandler';
// Note(!): Only importing explicitly here
// to be able to re-export for use in index.html below.
import {checkForName, onBlur} from './js/nameChecker';

// Note(!): Sequence is essential here. 'resets' must come first!
import './styles/resets.scss';
import './styles/base.scss';
import './styles/header.scss';
import './styles/form.scss';
import './styles/footer.scss';

alert('I EXIST');
console.log('CHANGE!!');

export {handleSubmit, checkForName, onBlur};
