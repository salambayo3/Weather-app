const wrapper = document.querySelector(".wrapper"),
    inputPart = wrapper.querySelector(".input-part"),
    infoTxt = inputPart.querySelector(".info-txt"),
    inputField = inputPart.querySelector("input"),
    locationBtn = inputPart.querySelector("button"),
    wIcon = document.querySelector(".weather-part img"),
    arrowBack = document.querySelector("h3 i");

let apiKey = '1caf75d08a537fe33fa92d617df15bd1';

let api;


inputField.addEventListener("keyup", e => {
    // if user pressed enter btn and input value is not empty
    if (e.key == "Enter" && inputField.value != "") {
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () => {
      alert("Currently not available")
    // if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(onSuccess, onError);
    // } else {
    //     alert("Your browser not support geolocation api");
    // }
});


function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    // fetchData();
}
function onError(error) {
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}




function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData();
}

function fetchData() {
    infoTxt.innerText = "Getting Weather Details.....";
    infoTxt.classList.add("pending");
    // getting api response and returning it with parsing into js obj and in another
    //then function calling weatherDetails....function with parsing api result as an argument

    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

// to display the weather
function weatherDetails(info) {
    infoTxt.classList.replace("pending", "error");
    if (info.cod == "404") {
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    } else {
        // getting the required property value from the info object
        const city = info.name;
        const country = info.sys.country;
        const { description, id } = info.weather[0];
        const { feels_like, humidity, temp } = info.main;
        if (id == 800) {
            wIcon.src = "./Weather Icons/clear.svg";
        } else if (id >= 200 && id <= 232) {
            wIcon.src = "./Weather Icons/storm.svg";
        } else if (id >= 600 && id <= 632) {
            wIcon.src = "./Weather Icons/snow.svg";
        } else if (id >= 701 && id <= 781) {
            wIcon.src = "./Weather Icons/haze.svg";
        } else if (id >= 801 && id <= 804) {
            wIcon.src = "./Weather Icons/cloud.svg";
        } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
            wIcon.src = "./Weather Icons/rain.svg";
        }

        // passing these values to a particular html element
        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = ` ${humidity}%`;

        infoTxt.classList.remove("pending", "error");
        wrapper.classList.add("active");
    }
}




arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
});
