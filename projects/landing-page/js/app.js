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
let navigableSections = [];
let scrollTimer = null;
let activeSection = null;
/*     End Global Variables        */

/*     Start Helper Functions      */
/*     Using nested helper functions to keep global namespace clean */
/*     End Helper Functions      */

/*      Begin Main Functions      */
const initApp = function() {
  const initGlobalState = function() {
    const findAllNavigableSections = function() {
      // Consider only sections with a landing container
      return [...document.querySelectorAll('section .landing__container')]
          .map((landingContainer) => landingContainer.parentElement);
    };

    navBarList = document.getElementById('navbar__list');
    navigableSections = findAllNavigableSections();
    if (navigableSections.length > 0) {
      activeSection = navigableSections[0];
    }
  };

  const initListeners = function() {
    window.addEventListener('scroll', handleScroll);
    navBarList.addEventListener('click', handleNavLinkClicked);
  };

  initGlobalState();
  initListeners();
};

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
  navigableSections
      .map((section) => buildNavItem(section))
      .forEach((navItem) => fragment.appendChild(navItem));
  navBarList.appendChild(fragment);
};

// Add class 'active' to section when near top of viewport
const activateSection = function() {
  /* Element is visible if either top or bottom has
   * a positive offset from the viewport's upper edge
   * and is not covered by the fixed nav bar. */
  const isVisible = function(element) {
    const bounds = element.getBoundingClientRect();
    const navBarHeight = navBarList.getBoundingClientRect().height;
    return bounds.top - navBarHeight >= 0 || bounds.bottom - navBarHeight >= 0;
  };
  const findFirstVisibleSection = function() {
    return navigableSections.find(isVisible);
  };

  const firstVisibleSection = findFirstVisibleSection();
  if (!firstVisibleSection) {
    return; // no visible containers, nothing to activate
  }
  if (firstVisibleSection !== activeSection) {
    [activeSection, firstVisibleSection].forEach((section) =>
      section.classList.toggle('active')
    );
    activeSection = firstVisibleSection;
  }
  // Delete the scroll timer so that
  // the next scroll event will not attempt to clear it
  scrollTimer = null;
};

// Scroll to anchor ID using scrollTO
const scrollToAnchor = function(href) {
  // Slice off the lead character '#'
  const targetId = href.slice(1);
  const target = document.getElementById(targetId);
  // Smooth scrolling option only works on FF and Chromium
  target.scrollIntoView({behavior: 'smooth'});
};
/*      End Main Functions      */

/*      Begin Events            */
// Build menu (and do general app initialization)
const handleDOMContentLoaded = function() {
  initApp();
  fillNavBar();
};

// Scroll to section on link click
const handleNavLinkClicked = function(event) {
  const isNavLink = function(target) {
    const tagName = target.nodeName;
    return tagName && tagName.toUpperCase() === 'A';
  };

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

// Defer initializing and running this script until DOM is ready.
// Needed to be able to load the script in the document's <head>.
window.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
