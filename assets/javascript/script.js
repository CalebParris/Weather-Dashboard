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
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + inputCity + "&appid=" + apiKey + "&units=Imperial";

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

        var temp = $("<p>");
        temp.text("Temperature: " + response.main.temp + " °F");

        var humidity = $("<p>");
        humidity.text("Humidity: " + response.main.humidity + "%");
        
        var windSpeed = $("<p>");
        windSpeed.text("Wind Speed: " + response.wind.speed + " MPH");

        var uvIndex = $("<p>");
        uvIndex.text("UV Index: ");

        $("#current-weather").append(temp, humidity, windSpeed);

    });
}

function fiveDayWeather(){
    var inputCity = $("#input-city").val();
    var apiKey = "acb674f7dc9a574ba0b5c0ef2926ec4f"
    var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + inputCity + "&appid=" + apiKey + "&units=Imperial";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
    });
}