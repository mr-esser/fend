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

/*     Define Global Variables     */
// Initialized by DOM ready handler
let navBarList = null;
let landingContainers = null;
let scrollTimer = null;
let activeSection = null;
/*     End Global Variables        */

/*     Start Helper Functions      */
const initApp = function() {
  const initGlobalState = function() {
    navBarList = document.getElementById('navbar__list');
    landingContainers = [
      ...document.querySelectorAll('div.landing__container'),
    ];
    if (landingContainers.length > 0) {
      activeSection = landingContainers[0].parentElement;
    }
  };

  const initListeners = function() {
    window.addEventListener('scroll', handleScroll);
    navBarList.addEventListener('click', handleNavLinkClicked);
  };

  initGlobalState();
  initListeners();
};

const isNavLink = function(target) {
  const tagName = target.nodeName;
  return tagName && tagName.toUpperCase() === 'A';
};
/*      End Helper Functions      */

/*      Begin Main Functions      */
// build the nav
const fillNavBar = function() {
  const buildNavItem = function(section) {
    const item = document.createElement('LI');
    const linkText = section.dataset.nav;
    const linkHref = section.id;
    item.innerHTML =
      `<a class="menu__link" href="#${linkHref}">${linkText}</span>`;
    return item;
  };

  const fragment = document.createDocumentFragment();

  const navigableSections = landingContainers.map(
      (landingContainer) => landingContainer.parentElement
  );
  navigableSections
      .map((section) => buildNavItem(section))
      .forEach((navItem) => fragment.appendChild(navItem));

  navBarList.appendChild(fragment);
};

// Add class 'active' to section when near top of viewport
const activateSection = function() {
  const isVisible = function(element) {
    const bounds = element.getBoundingClientRect();
    // true if either top or bottom has a positive offset
    // from the viewport's upper edge
    return bounds.top >= 0 || bounds.bottom >= 0;
  };
  const findFirstVisibleLandingContainer = function() {
    return landingContainers.find(isVisible);
  };

  const firstVisibleLandingContainer = findFirstVisibleLandingContainer();
  if (!firstVisibleLandingContainer) {
    return; // no visible containers, nothing to activate
  }
  const firstVisibleSection = firstVisibleLandingContainer.parentElement;
  if (firstVisibleSection !== activeSection) {
    [activeSection, firstVisibleSection].forEach((section) =>
      section.classList.toggle('active')
    );
    activeSection = firstVisibleSection;
  }
  // Clear the scroll timer
  // so that the next scroll event will not try to clear it
  scrollTimer = null;
};

// Scroll to anchor ID using scrollTO
const scrollToAnchor = function(href) {
  // Slice off the lead character '#'
  const targetId = href.slice(1);
  const target = document.getElementById(targetId);
  target.scrollIntoView({behavior: 'smooth'});
};
/*      End Main Functions      */

/*      Begin Events            */
// Build menu
const handleDOMContentLoaded = function() {
  initApp();
  fillNavBar();
};

// Scroll to section on link click
const handleNavLinkClicked = function(event) {
  // Prevent polluting the page history with anchor URLs
  event.preventDefault();
  const clicked = event.target;
  // Just to make sure it was really the <a> that was clicked
  if (isNavLink(clicked)) {
    scrollToAnchor(clicked.getAttribute('href'));
  }
};

// Set sections as active
// (as soon as the user has finished scrolling).
const handleScroll = function() {
  if (scrollTimer !== null) {
    // Discard the last event...
    clearTimeout(scrollTimer);
  }
  // ... and schedule the current one.
  // Will activate, if no more scroll events arrive.
  scrollTimer = setTimeout(activateSection, 100);
};

// Defer initializing and running the script until DOM is ready.
// Needed to be able to load the script in the document's <head>.
window.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
