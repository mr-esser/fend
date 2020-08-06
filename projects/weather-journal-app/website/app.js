/* Global Variables */
// Personal API Key for OpenWeatherMap API
const apiKey = 'c6fc4d916e42eed6b3cc6fa9dd279427';
// Cache to avoid Web API refusing requests due to excessive request rate
const weatherDataCache = new Map();
const minPause = 12 * 60 * 1000; // 12 minutes

// Create a new date instance dynamically with JS
const d = new Date();
const newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();
// TODO: Just here to keep linter happy. Remove later
console.log(newDate);

/* Helper functions */
const buildUrl = function(zipCode, units) {
  return `http://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&units=${units}&appid=${apiKey}`;
};

const getWeatherDataFromCache = function(zipAndCountryCode) {
  let result;
  if (weatherDataCache.has(zipAndCountryCode)) {
    const cachedResponse = weatherDataCache.get(zipAndCountryCode);
    const lastUpdated = cachedResponse.timestamp;
    if (Date.now() - lastUpdated <= minPause) {
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

const fetchWeatherDataFromWebApi = async function(zipAndCountryCode, units) {
  const response = await fetch(buildUrl(zipAndCountryCode, units));
  return await response.json();
};

// Event listener to add function to existing HTML DOM element

/* Function called by event listener */

/* Function to GET Web API Data*/
const getWeatherData = async function(zipAndCountryCode, units) {
  let data = getWeatherDataFromCache(zipAndCountryCode);
  if (!data) {
    // TODO: Set-up appropriate error handling, here!
    data = await fetchWeatherDataFromWebApi(zipAndCountryCode, units);
    cacheWeatherData(zipAndCountryCode, data);
    console.log('Cached!');
  } else {
    console.log('Retrieved from cache!');
  }
  return data;
};

/* Function to POST data */

/* Function to GET Project Data */

// TODO: For testing purposes only. Remove later.
// getWeatherData('52152,de', 'metric');
// setTimeout(() => getWeatherData('52152,de', 'metric')
//     .then((data) => console.log(JSON.stringify(data))), 1000);
