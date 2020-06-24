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
let main = null;
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
      return [...document.querySelectorAll('section .landing__container')].map(
          (landingContainer) => landingContainer.parentElement
      );
    };
    const activateTopSection = function(sections, container) {
      // Must hide container here to avoid unnecessary reflows
      container.style.display = 'none';
      // Reset active bit on all sections to guarantee a clean state
      sections.forEach((section) => section.classList.remove('active'));
      const topSection = sections[0];
      topSection.classList.add('active');
      container.attributes.removeNamedItem('style');
      return topSection;
    };

    main = document.querySelector('main');
    navBarList = document.getElementById('navbar__list');
    navigableSections = findAllNavigableSections();
    if (navigableSections.length > 0) {
      activeSection = activateTopSection(navigableSections, main);
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
    item.innerHTML = //
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
const activateTopVisibleSection = function() {
  const findTopVisibleSection = function() {
    /* Element counts as visible if at least
     * 15% if its height are showing below the nav bar.
     * This tolerance helps reliably activate sections
     * after scrolling. */
    const isVisible = function(element) {
      const elementBounds = element.getBoundingClientRect();
      const navBarHeight = navBarList.getBoundingClientRect().height;
      if (elementBounds.top - navBarHeight >= 0) {
        return true;
      }
      const elementBottomAdjusted = elementBounds.bottom - navBarHeight;
      if (elementBottomAdjusted >= 0) {
        const visibleArea = elementBottomAdjusted / elementBounds.height;
        return visibleArea >= 0.15;
      }
    };

    return navigableSections.find(isVisible);
  };
  const toggleActiveStyle = function(section) {
    section && section.classList && section.classList.toggle('active');
  };

  const topVisibleSection = findTopVisibleSection();
  if (topVisibleSection !== activeSection) {
    // Note(!): Hiding the container would not speed-up things here.
    [activeSection, topVisibleSection].forEach(toggleActiveStyle);
    activeSection = topVisibleSection;
  }

  // Delete the scroll timer so that
  // the next scroll event will not attempt to clear it
  scrollTimer = null;
};

// Scroll to anchor ID using scrollTO
const scrollToAnchor = function(href) {
  const computeTargetPageY = function(target) {
    const offsetViewportFromPageStart = window.pageYOffset;
    const offsetTargetFromViewport = target.getBoundingClientRect().top;
    const navBarHeight = navBarList.getBoundingClientRect().height;
    // Nav should not cover the start of the target element,
    // so stop scrolling a little farther up by subtracting the nav's height.
    return (
      offsetViewportFromPageStart + offsetTargetFromViewport - navBarHeight
    );
  };

  // Slice off the lead character '#'
  const targetId = href.slice(1);
  const target = document.getElementById(targetId);
  const targetY = computeTargetPageY(target);
  // Unfortunately, smooth scrolling is not really supported
  window.scroll(0, targetY);
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
  scrollTimer = setTimeout(activateTopVisibleSection, 100);
};

// Defer initializing and running this script until DOM is ready.
// Needed to be able to load the script in the document's <head>.
window.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
