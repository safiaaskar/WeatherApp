const apiKey = APIKEY;
const dateObj = new Date();

const getDayName = (dayType, dateVal = dateObj) =>
  dateVal.toLocaleDateString("en-US", { weekday: dayType });

// Retrieve weather data from the API and update the UI
function fetchWeatherData(location) {
  // const endpoint = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;
  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(
    location,
  )}&days=5`;

  const currentDay = getDayName("long");
  const fullDateStr = dateObj.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  document.querySelector(".date-day").textContent = fullDateStr;
  document.querySelector(".date-dayname").textContent = currentDay;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data)
      document.querySelector(".location").textContent =
        data.location.name + ", " + data.location.country;
      document.querySelector(".weather-temp").textContent =
        data.current.temp_c + "°C";

      updateForecastData(data.forecast);
    })
    .catch((error) => {
      console.log("Error fetching weather data:", error);
    });
}
/// function to update forecast data
function updateForecastData(forecastData) {
  const weekContainer = document.querySelector(".week-list");
  weekContainer.innerHTML = "";
  forecastData.forecastday.forEach((dayObj) => {
    const currentDate = new Date(dayObj.date);
    if (currentDate.toDateString() !== dateObj.toDateString()) {
      const liEl = document.createElement("li");
      liEl.innerHTML = `
          <span class="day-name">${getDayName(
            "short",
            currentDate,
          )}</span><span class="day-temp">${dayObj.day.maxtemp_c}°C</span>
        `;
      weekContainer.appendChild(liEl);
    }
  });
}
// On page load, fetch and display the current weather for the user's location
navigator.geolocation.getCurrentPosition(
  (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const location = `${latitude},${longitude}`;
    fetchWeatherData(location);
  },
  (error) => {
    console.log("Error getting location:", error);
  },
);
