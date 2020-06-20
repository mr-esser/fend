/* eslint-disable object-curly-spacing */
/* eslint-disable indent */
/* eslint-disable comma-dangle */
/* eslint-disable require-jsdoc */
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
let isScrolling = false;
let activeSection = null;
/*     End Global Variables        */

/*     Start Helper Functions      */
function initApp() {
  initGlobalState();
  initListeners();

  function initGlobalState() {
    navBarList = document.getElementById('navbar__list');
    landingContainers = [
      ...document.querySelectorAll('div.landing__container')
    ];
    activeSection = landingContainers[0].parentElement;
  }

  function initListeners() {
    window.addEventListener('scroll', handleScroll);
    navBarList.addEventListener('click', handleNavLinkClicked);
  }
}

function isNavLink(target) {
  const tagName = target.nodeName;
  return tagName && tagName.toUpperCase() === 'A';
}
/*      End Helper Functions      */

/*      Begin Main Functions      */
// build the nav
// TODO: Test on page without sections (legal). Or an additional fifth section.
function fillNavBar() {
  const fragment = document.createDocumentFragment();
  const navigableSections = landingContainers.map(
    (landingContainer) => landingContainer.parentElement
  );
  navigableSections
    .map((section) => buildNavItem(section))
    .forEach((navItem) => fragment.appendChild(navItem));
  navBarList.appendChild(fragment);

  function buildNavItem(section) {
    const item = document.createElement('LI');
    const linkText = section.dataset.nav;
    const linkHref = section.id;
    item.innerHTML =
         `<a class="menu__link" href="#${linkHref}">${linkText}</span>`;
    return item;
  }
}

// Add class 'active' to section when near top of viewport
function activateSection() {
  // TODO: There could be no visible section at all (legal).
  const firstVisibleSection = findFirstVisibleLandingContainer().parentElement;
  if (firstVisibleSection !== activeSection) {
    // TODO: Optimize redraw/reflow
    [activeSection, firstVisibleSection].forEach((section) =>
      section.classList.toggle('active')
    );
    activeSection = firstVisibleSection;
  }
  // Reset the scroll flag!
  isScrolling = false;

  function findFirstVisibleLandingContainer() {
    return landingContainers.find(isVisible);

    function isVisible(element) {
      const bounds = element.getBoundingClientRect();
      return bounds.top >= 0 || bounds.bottom >= 0;
    }
  }
}

// Scroll to anchor ID using scrollTO event
function scrollToAnchor(href) {
  const targetId = href.slice(1);
  const target = document.getElementById(targetId);
  target.scrollIntoView({ behavior: 'smooth' });
}
/*      End Main Functions      */

/*      Begin Events            */
// Build menu
function handleDOMContentLoaded() {
  initApp();
  fillNavBar();
}

// Scroll to section on link click
function handleNavLinkClicked(event) {
  // Prevent polluting the page history with anchor URLs
  event.preventDefault();

  const clicked = event.target;
  if (isNavLink(clicked)) {
    scrollToAnchor(clicked.getAttribute('href'));
  }
}

// Set sections as active
function handleScroll() {
  if (!isScrolling) {
    isScrolling = true;
    setTimeout(activateSection, 250);
  }
}

// Defer initializing and running the script until DOM is ready.
// Needed to load the script in the document's <head>.
window.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
