const apiKey = 'dce0230841ba4dd7b5723747240711'; // Replace with your OpenWeather API key

document.getElementById('searchButton').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        showError('Please enter a city name.');
    }
});

function fetchWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => {
            if (!response.ok) throw new Error('City not found');
            return response.json();
        })
        .then(data => {
            displayWeather(data);
            fetchForecast(data.coord.lat, data.coord.lon);
        })
        .catch(error => showError(error.message));
}

function fetchForecast(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${apiKey}`)
        .then(response => {
            if (!response.ok) throw new Error('Unable to fetch forecast');
            return response.json();
        })
        .then(data => displayForecast(data.daily))
        .catch(error => showError(error.message));
}

function displayWeather(data) {
    const isDay = (data.dt + data.timezone) > data.sys.sunrise && (data.dt + data.timezone) < data.sys.sunset;
    
    // Set the background image based on the weather condition
    const weatherCondition = data.weather[0].main.toLowerCase();
    setBackgroundImage(weatherCondition);

    // Update the weather info
    const weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById('weatherIcon').src = weatherIcon;

    document.getElementById('weatherInfo').classList.remove('d-none');
    document.getElementById('cityName').innerText = `${data.name}, ${data.sys.country}`;
    document.getElementById('description').innerText = data.weather[0].description;
    document.getElementById('temperature').innerText = `${data.main.temp} °C`;
    document.getElementById('details').innerText = `Humidity: ${data.main.humidity}% | Wind Speed: ${data.wind.speed} m/s`;
    document.getElementById('dayNightIndicator').innerText = isDay ? 'It is daytime 🌞' : 'It is nighttime 🌃';
}

function displayForecast(forecastData) {
    const forecastCards = document.getElementById('forecastCards');
    forecastCards.innerHTML = '';

    forecastData.slice(0, 7).forEach(day => {
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <h5>${new Date(day.dt * 1000).toLocaleDateString()}</h5>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="${day.weather[0].description}" />
            <p>${day.weather[0].description}</p>
            <h6>Day: ${day.temp.day} °C</h6>
            <h6>Night: ${day.temp.night} °C</h6>
        `;
        forecastCards.appendChild(card);
    });
}

function setBackgroundImage(condition) {
    let backgroundUrl = '';
    switch (condition) {
        case 'clear':
            backgroundUrl = 'url(./images/sunny.jpg)'; 
            break;
        case 'clouds':
            backgroundUrl = 'url(./images/cloudy.jpg)';
            break;
        case 'rain':
            backgroundUrl = 'url(./images/rainy.jpg)';
            break;
        case 'snow':
            backgroundUrl = 'url(./images/snowy.jpg)';
            break;
        case 'thunderstorm':
            backgroundUrl = 'url(./images/thunderstorm.jpg)';
            break;
        case 'drizzle':
            backgroundUrl = 'url(./images/drizzle.jpg)';
            break;
        default:
            backgroundUrl = 'url(./images/default.jpg)';
            break;
    }
    document.body.style.backgroundImage = backgroundUrl;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center center';
}

function showError(message) {
    alert(message); // Show error message if something goes wrong
}
