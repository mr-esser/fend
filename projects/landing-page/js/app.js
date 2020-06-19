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
// TODO: Make mutable and set via onload handler
const NAV_BAR_LIST = getNavBarList();
const LANDING_CONTAINERS = findAllLandingContainers();

let isScrolling = false;
let activeSection = getFirstSection();
/**** End Global Variables ****/

/**** Start Helper Functions ****/
function getNavBarList() {
  return document.getElementById("navbar__list");
}

function findAllLandingContainers() {
  return [...document.querySelectorAll("div.landing__container")];
}

function getFirstSection(landingContaines) {
  return LANDING_CONTAINERS[0].parentElement;
}
/**** End Helper Functions ****/

/**** Begin Main Functions ****/
// build the nav
// TODO: Test on page without sections (legal). Or an additional fifth section.
function fillNavBar() {
  const fragment = document.createDocumentFragment();
  const navigableSections = LANDING_CONTAINERS.map((landingContainer) => landingContainer.parentElement);
  navigableSections.map((section) => buildNavItem(section)).forEach((navItem) => fragment.appendChild(navItem));
  NAV_BAR_LIST.appendChild(fragment);

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
  // TODO: There could be no visible section at all (legal).
  const firstVisibleSection = findFirstVisibleLandingContainer().parentElement;
  if (firstVisibleSection !== activeSection) {
    // TODO: Optimize redraw/reflow
    [activeSection, firstVisibleSection].forEach((s) => s.classList.toggle("active"));
    activeSection = firstVisibleSection;
  }
  // Reset the timer.
  isScrolling = false;

  function findFirstVisibleLandingContainer() {
    return LANDING_CONTAINERS.find(isVisible);

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
function handleNavLinkClicked(event) {
  // Prevent polluting the page history with anchor URLs
  event.preventDefault();

  const clicked = event.target;
  if (isNavLink(clicked)) {
    scrollToAnchor(clicked.getAttribute("href"));
  }

  function isNavLink(target) {
    const elementTag = target.nodeName;
    return elementTag && elementTag.toUpperCase() === "A";
  }
}

// Set sections as active
function handleScroll(_event) {
  if (!isScrolling) {
    isScrolling = true;
    setTimeout(activateSection, 250);
  }
}

window.addEventListener("scroll", handleScroll);
NAV_BAR_LIST.addEventListener("click", handleNavLinkClicked);