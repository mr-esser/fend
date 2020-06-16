/**
 * 
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 * 
 * Dependencies: None
 * 
 * JS Version: ES2015/ES6
 * 
 * JS Standard: ESlint
 * 
*/

/**
 * Define Global Variables
 * 
*/
let scrollTimer = null;

let activeSection = document.querySelector('section');
console.log(activeSection);
console.log(getVisibleLandingContainer());

/**
 * End Global Variables
 *
 * Start Helper Functions
 * 
*/
function isVisible(section) {
  const bounds = section.getBoundingClientRect();
  return bounds.top >= 0 || bounds.bottom >= 0;
}

function getVisibleLandingContainer() {
  const landingContainers = [...document.querySelectorAll('div.landing__container')];
  return landingContainers.find(isVisible);
}

function activateSection() {
  const sectionToActivate = getVisibleLandingContainer().parentElement;
  if (sectionToActivate !== activeSection) {
    // TODO: Optimize redraw/reflow
    [activeSection, sectionToActivate].forEach(s => s.classList.toggle('your-active-class'));
    activeSection = sectionToActivate;
  }
  scrollTimer = null;
}

function handleScroll(event) {
  if (!scrollTimer) {
    scrollTimer = setTimeout(activateSection, 250);
  }
}
/**
 * End Helper Functions
 * Begin Main Functions
 * 
*/

// build the nav


// Add class 'active' to section when near top of viewport


// Scroll to anchor ID using scrollTO event

/**
 * End Main Functions
 * Begin Events
 *
*/

// Build menu 

// Scroll to section on link click

// Set sections as active

window.addEventListener('scroll', (event) => handleScroll(event));
console.log('Scipt loaded!');