import {handleSubmit} from './js/formHandler';
// Note(!): Only importing explicitly here so that
// functions can be re-exported for use in index.html below.
import {checkForName, onBlur} from './js/nameChecker';

// Note(!): Sequence is essential here. 'resets' must come first!
// And then the css-tooltips so that they can be overridden later.
import './styles/resets.scss';
import 'modules/css-tooltip/dist/css-tooltip.css';
import './styles/base.scss';
import './styles/header.scss';
import './styles/form.scss';
import './styles/main.scss';
import './styles/footer.scss';
import 'modules/spinkit/spinkit.css';

export {handleSubmit, checkForName, onBlur};
