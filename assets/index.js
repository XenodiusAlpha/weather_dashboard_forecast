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
let dayCard = '';
let city = '';
let cityArray = [];
let currentDay = dayjs().format("YYYY/M/D");

function searchCity(e) {
    // prevent form from clearing on submit
    e.preventDefault();
    // variable to hold currently searched city's value
    let newCity = searchCityEl.value;
    // variable to hold past searched city's text content
    let pastCity = e.target.textContent;
    // if no city is entered and submit button is pressed, exit function
    if(!newCity && !pastCity) {
        console.log("insert a city");
        return;
    }
    // checks to see if newCity already exists in cityArray, if it does, set city variable to newCity and fetch information
    if(cityArray.includes(newCity)) {
        city = newCity;
    // checks to see if pastCity already exists in cityArray, if it does, set city variable to pastCity and fetch information
    }else if (cityArray.includes(pastCity)) {
        city = pastCity;
    // if newCity is not in cityArray then set city to newCity and continue in else statement
    } else {
        city = newCity;
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

    // using fetch to retreive data from new end point
    fetch(queryCityURL)
        .then((res) => {
            // returning response
            return res.json();
        })
        .then((data) => {
            // stringifying the data in a variable to be used.
            let currentCityData = JSON.stringify(data);
            // setting data to local storage
            localStorage.setItem("cityData", currentCityData);
            // creating variable for the image icon of the current weather and retreiving it from the end point
            let weatherIconEl = document.createElement("img");
            weatherIconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            // setting the name and the current day of the searched city
            cityNameEl.textContent = `${city} (${currentDay}) `;
            // appending the icon retreived.
            cityNameEl.append(weatherIconEl);
            // setting the temp, wind, and humidity
            cityTempEl.textContent = `Temp: ${data.main.temp}°C`;
            cityWindEl.textContent = `Wind: ${data.wind.speed}km/h`;
            cityHumidityEl.textContent = `Humidity: ${data.main.humidity}%`;

            // declaring variables for lattitude and longitude to be used in 5 day forecast.
            let lat = data.coord.lat;
            let lon = data.coord.lon;
            console.log(lat, lon);
            // using fetch to retreive data using the lat and lon for the new end point
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${APIKey}`)
            // returning response
            .then((res) => {
                return res.json();
            })
            .then((fiveDayData) => {
                // stringifying the data in a variable to be used.
                let fiveDayForecastData = JSON.stringify(fiveDayData);
                // setting data to local storage
                localStorage.setItem("forcastData", fiveDayForecastData);
                // clears previous cards from smallCardsEl when searching new city
                while (smallCardsEL.firstChild) {
                    smallCardsEL.removeChild(smallCardsEL.lastChild);
                  }
                // looping through data to add each distintive day to a card for five day forecast
                for(let i = 7; i < fiveDayData.list.length; i += 8){
                    // creating container for each day being looped
                    dayCard = document.createElement("div");
                    // adding class for styling
                    dayCard.classList.add("dayCard");
                    // adding data to populate the cards
                    dayCard.innerHTML = `
                    <h5>
                        ${fiveDayData.list[i].dt_txt.slice(0, 10)}
                    </h5>
                    <p>
                        <img src="https://openweathermap.org/img/wn/${fiveDayData.list[i].weather[0].icon}@2x.png">
                    </p>
                    <h6>
                        Temp: ${fiveDayData.list[i].main.temp}°C
                    </h6>
                    <h6>
                        Wind: ${fiveDayData.list[i].wind.speed}km/h
                    </h6>
                    <h6>
                        Humidity: ${fiveDayData.list[i].main.humidity}%
                    </h6>
                    `;
                    // adding the dayCard's to the smallCardsEl container
                    smallCardsEL.appendChild(dayCard);
                }
            })
        })
}



searchBtn.onclick = searchCity;

pastSearchesBtnEl.onclick = searchCity;