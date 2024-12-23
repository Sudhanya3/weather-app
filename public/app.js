const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value;

  if (city) {
    try {
      const weatherData = await getWeatherData(city);
      displayWeatherInfo(weatherData);
    } catch (error) {
      console.error(error);
      displayError(error);
    }
  } else {
    displayError("Please enter a city");
  }
});

async function getWeatherData(city) {
  const apiKeyResponse = await fetch("http://localhost:3000/api/getApiKey");
  if (!apiKeyResponse.ok) {
    throw new Error("Failed to fetch the API key");
  }
  const { apiKey } = await apiKeyResponse.json();

  // Use the API key to request weather data
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("Could not fetch weather data");
  }
  return await response.json();
  
}

function displayWeatherInfo(data) {
  const {
    name: city,
    main: { temp, humidity },
    weather: [{ description, id }],
  } = data;

  card.textContent = "";
  card.style.display = "flex";

  const cityDisplay = document.createElement("h1");
  const tempDisplay = document.createElement("p");
  const humidityDisplay = document.createElement("p");
  const descDisplay = document.createElement("p");
  const weatherEmoji = document.createElement("p");

  cityDisplay.textContent = city;
  tempDisplay.textContent = `${((temp - 273.15) * (9 / 5) + 32).toFixed(1)}°F`;
  humidityDisplay.textContent = `Humidity: ${humidity}%`;
  descDisplay.textContent = description;
  weatherEmoji.textContent = getWeatherEmoji(id);

  cityDisplay.classList.add("cityDisplay");
  tempDisplay.classList.add("tempDisplay");
  humidityDisplay.classList.add("humidityDisplay");
  descDisplay.classList.add("descDisplay");
  weatherEmoji.classList.add("weatherEmoji");

  card.appendChild(cityDisplay);
  card.appendChild(tempDisplay);
  card.appendChild(humidityDisplay);
  card.appendChild(descDisplay);
  card.appendChild(weatherEmoji);

  updateBackground(id);
}

function getWeatherEmoji(weatherId) {
  switch (true) {
    case weatherId >= 200 && weatherId < 300:
      return "⛈";
    case weatherId >= 300 && weatherId < 400:
      return "🌧";
    case weatherId >= 500 && weatherId < 600:
      return "🌧";
    case weatherId >= 600 && weatherId < 700:
      return "❄";
    case weatherId >= 700 && weatherId < 800:
      return "🌫";
    case weatherId === 800:
      return "☀";
    case weatherId >= 801 && weatherId < 810:
      return "☁";
    default:
      return "❓";
  }
}

function updateBackground(weatherId) {
  const body = document.body;

  switch (true) {
    case weatherId >= 200 && weatherId < 300:
      body.style.backgroundImage = "url('/images/thunderstorm.jpg')";
      break;
    case weatherId >= 300 && weatherId < 400:
      body.style.backgroundImage = "url('/images/drizzle.png')";
      break;
    case weatherId >= 500 && weatherId < 600:
      body.style.backgroundImage = "url('/images/rain.jpeg')";
      break;
    case weatherId >= 600 && weatherId < 700:
      body.style.backgroundImage = "url('/images/snow.png')";
      break;
    case weatherId >= 700 && weatherId < 800:
      body.style.backgroundImage = "url('/images/fog.jpg')";
      break;
    case weatherId === 800:
      body.style.backgroundImage = "url('/images/clear.jpg')";
      break;
    case weatherId >= 801 && weatherId < 810:
      body.style.backgroundImage = "url('/images/cloudy.jpg')";
      break;
    default:
      body.style.backgroundImage = "url('/images/default.jpg')";
  }

  body.style.backgroundSize = "cover";
  body.style.backgroundPosition = "center";
}

function displayError(message) {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");

  card.textContent = "";
  card.style.display = "flex";
  card.appendChild(errorDisplay);
}
