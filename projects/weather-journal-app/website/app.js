/* Global Variables */
// Personal API Key for OpenWeatherMap API
const WEATHER_API_KEY = 'c6fc4d916e42eed6b3cc6fa9dd279427';
// Pause enforced in-between identical weather map API requests
const REQUEST_PAUSE = 12 * 60 * 1000; // 12 minutes
// Unit system used in weather map API requests
const UNITS = 'metric';
// Cache to help avoid request rejections due to excessive request rate
const weatherDataCache = new Map();

/* **** Begin general helper functions **** */
// Today's date printed in an unambiguous format (e.g.: 'Thu Jan 01 1970').
// App could be up for a long time, so not making this a constant.
const createDisplayDate = function() {
  return new Date().toDateString();
};

const getWeatherServiceUrl = function(zipAndCountryCode) {
  return `http://api.openweathermap.org/data/2.5/weather?zip=${zipAndCountryCode}&units=${UNITS}&appid=${WEATHER_API_KEY}`;
};

const getJournalServiceUrl = function(route = 'all') {
  return `http://localhost:3030/${route}`;
};

/* Will not validate the input! */
const getInputText = function(selector) {
  const element = document.querySelector(selector);
  if (element && 'value' in element) {
    return element.value.trim();
  }
  return '';
};

/* Update the most recent entry in the UI */
const updateUI = function(date='', location='', temperature='', content='') {
  const container = document.querySelector('#entryHolder');
  // TODO: Avoid several reflows. Check if really faster this way.
  container.style = 'display: none;';
  container.querySelector('#date').innerHTML = date;
  container.querySelector('#location').innerHTML = location;
  container.querySelector('#temp').innerHTML = temperature;
  container.querySelector('#content').innerHTML = content;
  container.style = '';
};
/* **** End general helper functions **** */

/* Function to GET weather data from third-party service.
 * Will attempt to cache requests. */
const getWeatherData = async function(zipAndCountryCode) {
  const cacheWeatherData = function(zipAndCountryCode, weatherData) {
    weatherDataCache.set(zipAndCountryCode, {
      timestamp: Date.now(),
      response: weatherData,
    });
  };
  const fetchWeatherDataFromService = async function(zipAndCountryCode) {
    const serviceUrl = getWeatherServiceUrl(zipAndCountryCode);
    // Note(!): fetch will only reject on network errors!
    const response = await fetch(serviceUrl);
    return response.json();
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

  let data = getWeatherDataFromCache(zipAndCountryCode);
  if (!data) {
    data = await fetchWeatherDataFromService(zipAndCountryCode);
    cacheWeatherData(zipAndCountryCode, data);
  }
  return data;
};

/* Function to POST project data to sever */
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

/* Function to GET project data from server */
const getJournalData = async function(url = '') {
  // Note(!): fetch will only reject on network errors!
  const response = await fetch(url);
  return response.json();
};

/* MAIN function called by event listener on 'Generate' button */
const handleGenerate = async function handleGenerate(event) {
  const buildJournalData = async function() {
    const journalData = {
      date: createDisplayDate(),
      location: 'unavailable',
      temperature: 'unavailable',
      content: getInputText('#feelings'),
    };
    try {
      const weatherData = await getWeatherData(getInputText('#zip'));
      console.log('Weather service response is: ' + weatherData.cod);
      // Temperature unit is hard-coded. See constant UNITS.
      journalData.temperature = `${weatherData.main.temp} °C`;
      journalData.location = `${weatherData.name}, ${weatherData.sys.country}`;
    } catch (error) {
      // Data is incomplete, but it can still be posted and displayed.
      // So log and then go on.
      console.log(error);
    }
    return journalData;
  };

  const synchronizeWithServer = async function(journalData) {
    await postJournalData(getJournalServiceUrl(), journalData);
    return await getJournalData(getJournalServiceUrl());
  };

  try {
    const journalData = buildJournalData();
    const serverData = synchronizeWithServer(journalData);
    updateUI(serverData.date, serverData.location, serverData.temperature,
        serverData.content);
  // unrecoverable networking errors; i.e.: fetch rejected and threw.
  } catch (serverError) {
    updateUI('Something went terribly wrong. Please, try again later.'
        , JSON.stringify(serverError)
    );
  }
};

// Event listener to add function to existing 'Generate' button.
window.addEventListener('DOMContentLoaded', () => {
  const generateButton = document.querySelector('#generate');
  // Note(!) Button does not generate 'submit' event here
  // because there is no form involved.
  generateButton.addEventListener('click', handleGenerate);
});
