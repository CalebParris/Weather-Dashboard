var inputCity = $("#input-city");
var searchSection = $("#form-extraBtns");
var lattitude, longitude;


$("#search-btn").on("click", function(event){
    event.preventDefault();
    var cityName = inputCity.val();

    if (cityName.trim() === "" ){
        $("#city-form").trigger("reset");
        return false;
    }

    for (var i = 0; i < cityName.length; i++){
        var regex = /^[0-9!@#$%^&*(),.?":{}|<>]*$/;
        if (regex.test(cityName[i])){
            $("#city-form").trigger("reset");
            return false;
        }
    }

    var cityButton = $("<button>");
    cityButton.attr("data-city", inputCity.val());
    cityButton.text(inputCity.val());
    cityButton.addClass("btn");
    searchSection.append(cityButton, $("<br>"));

    currentWeather(cityName);
    fiveDayWeather(cityName);
    localStorage.setItem("City", cityName);


    $("#city-form").trigger("reset");
});

searchSection.on("click", ".btn", function(){
    var cityName = $(this).attr("data-city");
    currentWeather(cityName);
    fiveDayWeather(cityName);
    localStorage.setItem("City", cityName);
});

function currentWeather(city){
  
    var apiKey = "acb674f7dc9a574ba0b5c0ef2926ec4f"
    var queryURL = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        $("#current-weather").empty();
        console.log(response);

        var unixTime = response.dt;
        var date = new Date(unixTime * 1000);
        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear();
        var today = (month + 1) + "/" + day + "/" + year;

        var cityDate = $("<h3>");
        var weatherIcon = $("<img>");
        var iconURL = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
        weatherIcon.attr("src", iconURL);
        cityDate.text(response.name + " (" + today + ") ");
        cityDate.append(weatherIcon);
        $("#current-weather").append(cityDate);

        var currentTemp = $("<p>");
        currentTemp.text("Temperature: " + Math.floor(response.main.temp) + " °F");

        var currentHumidity = $("<p>");
        currentHumidity.text("Humidity: " + response.main.humidity + "%");
        
        var windSpeed = $("<p>");
        windSpeed.text("Wind Speed: " + response.wind.speed + " MPH");

        $("#current-weather").append(currentTemp, currentHumidity, windSpeed);

        lattitude = response.coord.lat;
        longitude = response.coord.lon;
        console.log(lattitude, longitude);
        uvIndex(lattitude, longitude);


    });
}

function fiveDayWeather(city){
    $("#five-day").empty();


    var apiKey = "acb674f7dc9a574ba0b5c0ef2926ec4f"
    var queryURL = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=imperial";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){

        var forcastTitle = $("<h3>");
        var forecastDiv = $("<div>");
        forecastDiv.addClass("forecast")
        forcastTitle.text("5-Day Forecast:");
        $("#five-day").append(forcastTitle, forecastDiv);

        for (var i = 0; i < response.list.length; i++){

            if (response.list[i].dt_txt.substring(11) === "12:00:00"){
                var unixTime = response.list[i].dt;
                var date = new Date(unixTime * 1000);
                var day = date.getDate();
                var month = date.getMonth();
                var year = date.getFullYear();
                var today = (month + 1) + "/" + day + "/" + year;

                var dayDiv = $("<div>");
                var forecastDate = $("<p>");
                var forecastIcon = $("<img>");
                var forecastTemp = $("<p>");
                var forecastHumidity = $("<p>");
                var iconURL = "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png";

                dayDiv.addClass("forecast-day")
                forecastDate.text(today);
                forecastIcon.attr("src", iconURL);
                forecastTemp.text("Temp: " + Math.floor(response.list[i].main.temp) + " °F");
                forecastHumidity.text("Humidity: " + response.list[i].main.humidity + "%");

                dayDiv.append(forecastDate, forecastIcon, forecastTemp, forecastHumidity);
                forecastDiv.append(dayDiv);


            }

        }
    });
}

function uvIndex(lat, lon){
    var apiKey = "acb674f7dc9a574ba0b5c0ef2926ec4f";
    var queryURL = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
        var uvIndexElement = $("<p>");
        var uvValue = $("<p>");
        uvIndexElement.addClass("ultra-violet")
        uvValue.text(response.value);
        uvIndexElement.text("Noon UV Index: ");
        uvIndexElement.append(uvValue);
        $("#current-weather").append(uvIndexElement);

        if (response.value < 3){
            uvValue.addClass("favorable");
        } else if (response.value > 2 && response.value < 8){
            uvValue.addClass("moderate");
            } else if (response.value > 7){
                uvValue.addClass("severe");
            }

    });
}

if (localStorage.getItem("City") !== null){
    currentWeather(localStorage.getItem("City"));
    fiveDayWeather(localStorage.getItem("City"));
}