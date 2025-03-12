const apiKey = "5231d833928643fd9d691705251203"; // Replace with your OpenWeatherMap API key
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const locationBtn = document.getElementById("location-btn");
const weatherInfo = document.getElementById("weather-info");

// Fetch weather by city name
async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`; 
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === 200) {
      const { name, main, weather } = data;
      const temperature = main.temp;
      const humidity = main.humidity;
      const description = weather[0].description;
      const icon = weather[0].icon;

      weatherInfo.innerHTML = `
        <h2>${name}</h2>
        <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
        <p>Temperature: ${temperature}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Description: ${description}</p>
      `;
      getForecast(city); // Fetch 5-day forecast
    } else {
      weatherInfo.innerHTML = `<p>City not found. Please try again.</p>`;
    }
  } catch (error) {
    weatherInfo.innerHTML = `<p>An error occurred. Please try again later.</p>`;
  }
}

// Fetch weather by geolocation
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeatherByCoords(lat, lon);
      },
      (error) => {
        weatherInfo.innerHTML = `<p>Geolocation failed: ${error.message}</p>`;
      }
    );
  } else {
    weatherInfo.innerHTML = `<p>Geolocation is not supported by your browser.</p>`;
  }
}

// Fetch weather by coordinates
async function getWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === 200) {
      const { name, main, weather } = data;
      const temperature = main.temp;
      const humidity = main.humidity;
      const description = weather[0].description;
      const icon = weather[0].icon;

      weatherInfo.innerHTML = `
        <h2>${name}</h2>
        <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
        <p>Temperature: ${temperature}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Description: ${description}</p>
      `;
      getForecastByCoords(lat, lon); // Fetch 5-day forecast
    } else {
      weatherInfo.innerHTML = `<p>Weather data not found.</p>`;
    }
  } catch (error) {
    weatherInfo.innerHTML = `<p>An error occurred. Please try again later.</p>`;
  }
}

// Fetch 5-day forecast by city name
async function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === "200") {
      const forecast = data.list.filter((item, index) => index % 8 === 0); // Get one forecast per day
      let forecastHTML = "<h3>5-Day Forecast</h3>";
      forecast.forEach((item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        const icon = item.weather[0].icon;
        const temp = item.main.temp;
        const description = item.weather[0].description;

        forecastHTML += `
          <div class="forecast-item">
            <p>${date}</p>
            <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
            <p>${temp}°C</p>
            <p>${description}</p>
          </div>
        `;
      });
      weatherInfo.innerHTML += forecastHTML;
    }
  } catch (error) {
    console.error("Error fetching forecast:", error);
  }
}

// Fetch 5-day forecast by coordinates
async function getForecastByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === "200") {
      const forecast = data.list.filter((item, index) => index % 8 === 0); // Get one forecast per day
      let forecastHTML = "<h3>5-Day Forecast</h3>";
      forecast.forEach((item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        const icon = item.weather[0].icon;
        const temp = item.main.temp;
        const description = item.weather[0].description;

        forecastHTML += `
          <div class="forecast-item">
            <p>${date}</p>
            <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
            <p>${temp}°C</p>
            <p>${description}</p>
          </div>
        `;
      });
      weatherInfo.innerHTML += forecastHTML;
    }
  } catch (error) {
    console.error("Error fetching forecast:", error);
  }
}

// Event listeners
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  } else {
    weatherInfo.innerHTML = `<p>Please enter a city name.</p>`;
  }
});

locationBtn.addEventListener("click", getLocation);

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});