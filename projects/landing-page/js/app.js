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

/**** Define Global Variables ****/
const NAV_BAR = document.getElementById("navbar__list");

let scrollTimer;
let activeSection = document.querySelector("section");
/**** End Global Variables ****/

/**** Start Helper Functions ****/
function findAllLandingContainers() {
  return [...document.querySelectorAll("div.landing__container")];
}

/**** End Helper Functions ****/

/**** Begin Main Functions ****/
// build the nav
function fillNavBar() {
  const fragment = document.createDocumentFragment();
  const navigableSections = findAllLandingContainers().map((landingContainer) => landingContainer.parentElement);
  navigableSections.map((section) => buildNavItem(section)).forEach((navItem) => fragment.appendChild(navItem));
  NAV_BAR.appendChild(fragment);

  function buildNavItem(section) {
    const item = document.createElement("LI");
    const linkText = section.dataset.nav;
    const linkHref = section.id;
    item.innerHTML = `<a class="menu__link" href="\#${linkHref}">${linkText}</span>`;
    return item;
  }
}

// Add class 'active' to section when near top of viewport
function activateSection() {
  const sectionToActivate = findFirstVisibleLandingContainer().parentElement;
  if (sectionToActivate !== activeSection) {
    // TODO: Optimize redraw/reflow
    [activeSection, sectionToActivate].forEach((s) => s.classList.toggle("active"));
    activeSection = sectionToActivate;
  }
  // Reset the timer. TODO: Consider renaming to isScrolling: boolean.
  scrollTimer = null;

  function findFirstVisibleLandingContainer() {
    return findAllLandingContainers().find(isVisible);

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
  target.scrollIntoView({ behavior: "smooth" });
}

/**** End Main Functions ****/

/**** Begin Events ****/
// Build menu
// TODO: wrap in event. Page loaded?
fillNavBar();

// Scroll to section on link click
function handleClick(event) {
  event.preventDefault();
  const clicked = [...NAV_BAR.querySelectorAll(".menu__link")].find((item) => item === event.target);
  if (clicked) {
    scrollToAnchor(clicked.getAttribute("href"));
  }
}

// Set sections as active
function handleScroll() {
  if (!scrollTimer) {
    scrollTimer = setTimeout(activateSection, 250);
  }
}

window.addEventListener("scroll", handleScroll);
window.addEventListener("click", handleClick);
