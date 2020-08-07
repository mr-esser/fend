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
const getWeatherServiceUrl = function(zipCode, units) {
  return `http://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&units=${units}&appid=${WEATHER_API_KEY}`;
};

const getJournalServiceUrl= function(route) {
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
const postProjectData = async function(url, projectData={}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(projectData)
  });
  return response.json();
};

/* Function to GET project data */
const getProjectData = async function(url) {
  const response = await fetch(url);
  return response.json();
};

// Event listener to add function to existing HTML DOM element

/* Function called by event listener */

// TODO: Remove later. Tests the external API and cache.
getWeatherData('52152,de', 'metric');
setTimeout(() => getWeatherData('52152,de', 'metric')
    .then((data) => console.log(JSON.stringify(data))), 1000);

// TODO: Remove later. Tests the server routes.
getProjectData(getJournalServiceUrl('all')).then((data) => {
  console.log(data); return data;
}).then((data) => postProjectData(getJournalServiceUrl('all'), {name: 'sample'})
).then( (data) => getProjectData(getJournalServiceUrl('all'))
).then((projectData) => console.log(projectData));
