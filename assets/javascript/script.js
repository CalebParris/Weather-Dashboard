$("#search-btn").on("click", function(event){
    event.preventDefault();

    var inputCity = $("#input-city").val();

    var cityButton = $("<button>");
    cityButton.text(inputCity);
    cityButton.addClass("btn");
    $("#form-extraBtns").append(cityButton);
    $("#form-extraBtns").append($("<br>"));

    console.log(inputCity);

    currentWeather();
    fiveDayWeather();

    $("#city-form").trigger("reset");
});

function currentWeather(){
    var inputCity = $("#input-city").val();
    var apiKey = "acb674f7dc9a574ba0b5c0ef2926ec4f"
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + inputCity + "&appid=" + apiKey + "&units=imperial";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
        $("#current-weather").empty();

        var unixTime = response.dt;
        var date = new Date(unixTime * 1000);
        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear();
        var today = (month + 1) + "/" + day + "/" + year;
        console.log(today);

        var cityDate = $("<h3>");
        var weatherIcon = $("<img>");
        var iconURL = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
        weatherIcon.attr("src", iconURL);
        cityDate.text(inputCity + " (" + today + ") ");
        cityDate.append(weatherIcon);
        $("#current-weather").append(cityDate);

        var currentTemp = $("<p>");
        currentTemp.text("Temperature: " + Math.floor(response.main.temp) + " °F");

        var currentHumidity = $("<p>");
        currentHumidity.text("Humidity: " + response.main.humidity + "%");
        
        var windSpeed = $("<p>");
        windSpeed.text("Wind Speed: " + response.wind.speed + " MPH");

        var uvIndex = $("<p>");
        uvIndex.text("UV Index: ");

        $("#current-weather").append(currentTemp, currentHumidity, windSpeed);

    });
}

function fiveDayWeather(){
    $("#five-day").empty();
    var inputCity = $("#input-city").val();
    var apiKey = "acb674f7dc9a574ba0b5c0ef2926ec4f"
    var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + inputCity + "&appid=" + apiKey + "&units=imperial";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);

        var forcastTitle = $("<h3>");
        var forecastDiv = $("<div>");
        forecastDiv.addClass("forecast")
        forcastTitle.text("5-Day Forecast:");
        $("#five-day").append(forcastTitle, forecastDiv);

        for (var i = 0; i < response.list.length; i++){

            if (response.list[i].dt_txt.substring(11) === "12:00:00"){
                console.log("Mid-day");
                var unixTime = response.list[i].dt;
                var date = new Date(unixTime * 1000);
                var day = date.getDate();
                var month = date.getMonth();
                var year = date.getFullYear();
                var today = (month + 1) + "/" + day + "/" + year;
                console.log(today);

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