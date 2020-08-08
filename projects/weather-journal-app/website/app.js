/* Global Variables */
// Personal API Key for OpenWeatherMap API
const WEATHER_API_KEY = 'c6fc4d916e42eed6b3cc6fa9dd279427';
// Pause enforced in-between identical weather map API requests
const REQUEST_PAUSE = 12 * 60 * 1000; // 12 minutes
// Unit system used in weather map API requests
const UNITS = 'metric';
// Cache to help avoid request rejections due to excessive request rate
const weatherDataCache = new Map();


/* Helper functions */
// Today's date printed in an unambiguous format (e.g.: 'Thu Jan 01 1970').
// App could be up for a long time, so not making this a constant.
function createDate() {
  return new Date().toDateString();
}

const getWeatherServiceUrl = function(zipAndCountryCode) {
  return `http://api.openweathermap.org/data/2.5/weather?zip=${zipAndCountryCode}&units=${UNITS}&appid=${WEATHER_API_KEY}`;
};

const getJournalServiceUrl = function(route = 'all') {
  return `http://localhost:3030/${route}`;
};

const getWeatherDataFromCache = function(zipAndCountryCode) {
  let result;
  if (weatherDataCache.has(zipAndCountryCode)) {
    const cachedResponse = weatherDataCache.get(zipAndCountryCode);
    const lastUpdated = cachedResponse.timestamp;
    const elapsedTime = Date.now() - lastUpdated;
    if (elapsedTime <= REQUEST_PAUSE) {
      result = cachedResponse.response;
    } else {
      weatherDataCache.delete(zipAndCountryCode);
    }
  }
  return result;
};

const cacheWeatherData = function(zipAndCountryCode, weatherData) {
  weatherDataCache.set(zipAndCountryCode, {
    timestamp: Date.now(),
    response: weatherData,
  });
};

const fetchWeatherDataFromService = async function(zipAndCountryCode, units) {
  const serviceUrl = getWeatherServiceUrl(zipAndCountryCode, units);
  // Note(!): fetch will only reject on network errors!
  const response = await fetch(serviceUrl);
  return response.json();
};

/* Function to GET data from third-party service */
const getWeatherData = async function(zipAndCountryCode, units) {
  let data = getWeatherDataFromCache(zipAndCountryCode);
  if (!data) {
    data = await fetchWeatherDataFromService(zipAndCountryCode, units);
    cacheWeatherData(zipAndCountryCode, data);
  }
  return data;
};

/* Function to POST project data */
const postJournalData = async function(url = '', journalData = {}) {
  // Note(!): fetch will only reject on network errors!
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(journalData),
  });
  return response.json();
};

/* Function to GET project data */
const getJournalData = async function(url = '') {
  // Note(!): fetch will only reject on network errors!
  const response = await fetch(url);
  return response.json();
};

/* Named function called by event listener */
const handleGenerate = async function handleGenerate(event) {
  // Read zip code. Accepting anything here.
  const zipInput = document.querySelector('#zip');
  const zipCode = zipInput.value.trim();

  // Read feelings. Accepting anything here.
  const feelingsTextArea = document.querySelector('#feelings');
  const feelingsText = feelingsTextArea.value.trim();

  // GET weather data
  const weatherData = await getWeatherData(zipCode);
  console.log('Weather service response is: ' + weatherData.cod);
  // TODO: Throw exception if weather data is not ok: cod !== 200

  // Extract temperature. Unit is hard-coded. See constant UNITS.
  // Try-catch just in case that retrieved data is incomplete.
  let temperature;
  try {
    temperature = `${weatherData.main.temp} °C`;
  } catch (e) {
    temperature = 'unavailable';
  }
  console.log('Temp: ' + temperature);

  // Extract location.
  // Try-catch just in case that retrieved data is incomplete.
  let location;
  try {
    location = `${weatherData.name}, ${weatherData.sys.country}`;
  } catch (e) {
    location = 'unavailable';
  }
  console.log('Location: ' + location);

  // TODO: Build accumulated data when network errors occurred.
  // Build journal data (date, location, temperature, feelings)
  const accumulatedData = {
    date: createDate(),
    temp: temperature,
    location: location,
    content: feelingsText,
  };

  // then POST to Journal App
  await postJournalData(getJournalServiceUrl(), accumulatedData);
  // TODO: May throw error when server is down. Propagate.

  // then GET From Journal App
  const journalData = await getJournalData(getJournalServiceUrl());
  // TODO: May throw error when server is down. Propagate.

  // then update the UI (hide outer container + set innerHtml)
  const container = document.querySelector('#entryHolder');
  // TODO: Avoid several reflows. Check if really faster this way.
  container.style = 'display: none;';
  const divDate = container.querySelector('#date');
  divDate.innerHTML = journalData.date;
  const divLocation = container.querySelector('#location');
  divLocation.innerHTML = journalData.location;
  const divTemp = container.querySelector('#temp');
  divTemp.innerHTML = journalData.temp;
  const divContent = container.querySelector('#content');
  divContent.innerHTML = journalData.content;
  container.style = '';

  // TODO: Mighty error catch block that will update most recent entry on
  // unrecoverable networking errors; i.e.: fetch rejected and threw.
};

// Event listener to add function to existing HTML DOM element
window.addEventListener('DOMContentLoaded', () => {
  const generateButton = document.querySelector('#generate');
  // Note: Button does not generate a form submit event here
  // because there is no such form in the HTML.
  generateButton.addEventListener('click', handleGenerate);
});

