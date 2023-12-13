// adding key for OpenWeather API
const APIKey = "8e10d617353a1aca94b98c31f4c4f62b";
// query endpoint
let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="
const containerRHEL = document.getElementById("containerRH");
containerRHEL.classList.add("displayNone");
const searchBtn = document.getElementById("searchBtn");
const pastSearchesBtnEL = document.getElementById("pastSearchesBtn");
const searchCityEl = document.getElementById("searchCity");
let cityArray = [];

function searchCity(e) {
    // prevent form from clearing on submit
    e.preventDefault();
    // variable to hold currently searched city's value
    let city = searchCityEl.value;
    
    if(!city) {
        return;
    }
    if(cityArray.includes(city)) {
        return;
    } else {
        cityArray.push(city);
        localStorage.setItem("city", JSON.stringify(cityArray));
        let newLiCity = document.createElement("li");
        newLiCity.classList.add("pastSearchesLi");
        let newCityBtn = document.createElement("button");
        newCityBtn.innerText = city;
        newLiCity.append(newCityBtn);
        pastSearchesBtnEL.appendChild(newLiCity);
    }
    let queryCityURL = `${queryURL}${city}&units=metric&appid=${APIKey}`;
    containerRHEL.classList.remove("displayNone");
}



searchBtn.onclick = searchCity;
