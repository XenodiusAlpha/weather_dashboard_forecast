// adding key for OpenWeather API
const APIKey = "8e10d617353a1aca94b98c31f4c4f62b";
// query endpoint
let queryURL = "https://api.openweathermap.org/data/2.5/weather?q="

const containerRHEl = document.getElementById("containerRH");
containerRHEl.classList.add("displayNone");
const searchBtn = document.getElementById("searchBtn");
const pastSearchesBtnEl = document.getElementById("pastSearchesBtn");
const searchCityEl = document.getElementById("searchCity");
const currentWeatherEl = document.getElementById("currentWeather");
const cityNameEl = document.getElementById("cityName");
const cityTempEl = document.getElementById("cityTemp");
const cityWindEl = document.getElementById("cityWind");
const cityHumidityEl = document.getElementById("cityHumidity");
const fiveDayForecastEl = document.getElementById("fiveDayForecast");
const smallCardsEL = document.getElementById("smallCards");

let cityArray = [];
let currentDay = dayjs().format("YYYY/M/D");


function searchCity(e) {
    // prevent form from clearing on submit
    e.preventDefault();
    // variable to hold currently searched city's value
    let city = searchCityEl.value;
    // if no city is entered and submit button is pressed, exit function
    if(!city) {
        return;
    }
    // checks to see if city alread exists in array, if it does exit function
    if(cityArray.includes(city)) {
        return;
    } else {
        // adding new city to array
        cityArray.push(city);
        // adding array to local storage
        localStorage.setItem("city", JSON.stringify(cityArray));
        // creating list item with a button inside for the new city
        let newLiCity = document.createElement("li");
        newLiCity.classList.add("pastSearchesLi");
        let newCityBtn = document.createElement("button");
        newCityBtn.innerText = city;
        // appending the li and btn to the ul of past searches
        newLiCity.append(newCityBtn);
        pastSearchesBtnEl.appendChild(newLiCity);
    }
    // updated endpoint to include the searched city, and declare and option for the units to be in metric format
    let queryCityURL = `${queryURL}${city}&units=metric&appid=${APIKey}`;
    // Displaying RH container
    containerRHEl.classList.remove("displayNone");

    fetch(queryCityURL)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data);
            let currentCityData = JSON.stringify(data);
            localStorage.setItem("cityData", currentCityData);
            let weatherIconEl = document.createElement("img");
            weatherIconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            cityNameEl.textContent = `${city} (${currentDay}) `;
            cityNameEl.append(weatherIconEl);
            cityTempEl.textContent = `Temp: ${data.main.temp}°C`;
            cityWindEl.textContent = `Wind: ${data.wind.speed}km/h`;
            cityHumidityEl.textContent = `Humidity: ${data.main.humidity}%`;

            let lat = data.coord.lat;
            let lon = data.coord.lon;
            console.log(lat, lon);

            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`)
            .then((res) => {
                return res.json();
            })
            .then((fiveDayData) => {
                console.log(fiveDayData);
                // TODO code for cards using fiveDayData
            })
        })
}



searchBtn.onclick = searchCity;
