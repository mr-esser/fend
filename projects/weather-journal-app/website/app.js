/* Global Variables */
// Personal API Key for OpenWeatherMap API
const WEATHER_API_KEY = 'c6fc4d916e42eed6b3cc6fa9dd279427';
// Pause in between identical weather map API requests
const REQUEST_PAUSE = 12 * 60 * 1000; // 12 minutes
// Cache to help avoid request rejections due to excessive request rate
const weatherDataCache = new Map();

// Create a new date instance dynamically with JS
const d = new Date();
const newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

/* Helper functions */
const getWeatherServiceUrl = function(zipCode, units='metric') {
  return `http://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&units=${units}&appid=${WEATHER_API_KEY}`;
};

const getJournalServiceUrl= function(route='all') {
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
  const response = await fetch(serviceUrl);
  return response.json();
};

/* Function to GET data from third-party service */
const getWeatherData = async function(zipAndCountryCode, units) {
  let data = getWeatherDataFromCache(zipAndCountryCode);
  if (!data) {
    // TODO: Set-up appropriate error handling, here!
    data = await fetchWeatherDataFromService(zipAndCountryCode, units);
    cacheWeatherData(zipAndCountryCode, data);
  }
  return data;
};

/* Function to POST project data */
const postJournalData = async function(url='', journalData={}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(journalData)
  });
  return response.json();
};

/* Function to GET project data */
const getJournalData = async function(url='') {
  const response = await fetch(url);
  return response.json();
};

/* Named function called by event listener */
const handleGenerate = async function handleGenerate(event) {
  // Read zip code
  const zipInput = document.querySelector('#zip');
  const zipCode = zipInput.value.trim();
  console.log('Zip is: ' + zipCode);
  // TODO: Throw error if not present and formatted right

  // Read feelings
  const feelingsTextArea = document.querySelector('#feelings');
  const feelingsText = feelingsTextArea.value.trim();
  console.log('Feelings is: ' + feelingsText);
  // TODO: Throw error if not present and formatted right

  // GET weather data
  const weatherData = await getWeatherData(zipCode);
  console.log('Weather: ' + weatherData);
  const temperature = weatherData.main.temp;
  console.log('Temp: ' + temperature);
  // TODO: Throw if temperature not present
  // build projectData (date, weather, feelings)
  const accumulatedData = {
    date: newDate,
    temp: temperature,
    content: feelingsText
  };
  // then POST to Journal App
  await postJournalData(getJournalServiceUrl(), accumulatedData);
  // TODO: Catch possible error and rethrow
  // then GET From Journal App
  const journalData = await getJournalData(getJournalServiceUrl());
  // TODO: Catch possible error

  // then update the UI (hide outer container + set innerHtml)
  const container = document.querySelector('#entryHolder');
  // TODO: Avoid several reflows. Check if really faster this way.
  container.style = 'display: none;';
  const divDate = container.querySelector('#date');
  divDate.innerHTML = journalData.date;
  const divTemp = container.querySelector('#temp');
  divTemp.innerHTML = journalData.temp;
  const divContent = container.querySelector('#content');
  divContent.innerHTML = journalData.content;
  container.style = '';

  // TODO: Mighty error catch block
};

// Event listener to add function to existing HTML DOM element
window.addEventListener('DOMContentLoaded', () => {
  const generateButton = document.querySelector('#generate');
  // Note: Button does not generate a form submit event here
  // because there is no such form in the HTML.
  generateButton.addEventListener('click', handleGenerate);
});

