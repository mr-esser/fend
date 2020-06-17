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

const navBar = document.getElementById("navbar__list");

let scrollTimer = null;

let activeSection = document.querySelector("section");
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
  return getAllLandingContainers().find(isVisible);
}

function getAllLandingContainers() {
  return [...document.querySelectorAll("div.landing__container")];
}

function activateSection() {
  const sectionToActivate = getVisibleLandingContainer().parentElement;
  if (sectionToActivate !== activeSection) {
    // TODO: Optimize redraw/reflow
    [activeSection, sectionToActivate].forEach((s) => s.classList.toggle("active"));
    activeSection = sectionToActivate;
  }
  scrollTimer = null;
}

function handleScroll() {
  if (!scrollTimer) {
    scrollTimer = setTimeout(activateSection, 250);
  }
}

// on the ul
function handleClick(event) {
  const clicked = [...navBar.querySelectorAll(".menu__link")].find((item) => item === event.target);
  if (clicked) {
    const target = document.getElementById(clicked.getAttribute("data-target"));
    target.scrollIntoView();
  }
}
/**
 * End Helper Functions
 * Begin Main Functions
 *
 */

// build the nav
function buildNavBar() {
  const fragment = document.createDocumentFragment();
  const navigableSections = getAllLandingContainers().map((l) => l.parentElement);
  navigableSections.map((section) => buildNavItem(section)).forEach((li) => fragment.appendChild(li));
  navBar.appendChild(fragment);

  function buildNavItem(section) {
    const li = document.createElement("LI");
    const liText = section.getAttribute("data-nav");
    const liTarget = section.id;
    li.innerHTML = `<span data-target="${liTarget}" class="menu__link">${liText}</span>`;
    return li;
  }
}
// Add class 'active' to section when near top of viewport

// Scroll to anchor ID using scrollTO event

/**
 * End Main Functions
 * Begin Events
 *
 */

// Build menu
buildNavBar();
// Scroll to section on link click

// Set sections as active

window.addEventListener("scroll", handleScroll);
window.addEventListener("click", handleClick);
console.log("Scipt loaded!");
