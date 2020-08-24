import {handleSubmit} from './js/formHandler';
// Note(!): Only importing explicitly here so that
// functions can be re-exported for use in index.html below.
import {checkForName, onBlur} from './js/nameChecker';

// Note(!): Sequence is essential here. 'resets' must come first!
import './styles/resets.scss';
import './styles/base.scss';
import './styles/header.scss';
import './styles/form.scss';
import './styles/footer.scss';

export {handleSubmit, checkForName, onBlur};
