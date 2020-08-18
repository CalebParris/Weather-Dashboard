// Defined these variables globally due to needing them in multiple places
var inputCity = $("#input-city");
var searchSection = $("#form-extraBtns");
var lattitude, longitude;

$("#search-btn").on("click", function(event){
    event.preventDefault();
    var cityName = inputCity.val();

    // This if statement checks for any empty input as well as clears leading/trailing spaces
    if (cityName.trim() === "" ){
        $("#city-form").trigger("reset"); // This clears the input field
        return false;
    }

    // This loop runs through each letter of the input city name to check for numbers and special characters
    for (var i = 0; i < cityName.length; i++){
        var regex = /^[0-9!@#$%^&*(),.?":{}|<>]*$/;
        if (regex.test(cityName[i])){
            $("#city-form").trigger("reset");
            return false;
        }
    }

    // This section creates a button based off the information that was typed in the Input field
    var cityButton = $("<button>");
    cityButton.attr("data-city", inputCity.val());
    cityButton.text(inputCity.val());
    cityButton.addClass("btn");
    searchSection.append(cityButton, $("<br>"));

    // This section calls the 2 fuinctions for pulling the weather data and then sets the name of the city into local storage
    currentWeather(cityName);
    fiveDayWeather(cityName);
    localStorage.setItem("City", cityName);


    $("#city-form").trigger("reset");
});

searchSection.on("click", ".btn", function(){
    var cityName = $(this).attr("data-city"); // This grabs the name of the city based on the button clicked
    currentWeather(cityName);
    fiveDayWeather(cityName);
    localStorage.setItem("City", cityName);
});

// This function is for pulling the current weather information
function currentWeather(city){
  
    var apiKey = "acb674f7dc9a574ba0b5c0ef2926ec4f"
    var queryURL = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        $("#current-weather").empty(); // This clears the element so that any new city searched will appear in the same place
        console.log(response);

        // This section pulls the unix time code from the response and converts it into a readable format
        var unixTime = response.dt;
        var date = new Date(unixTime * 1000);
        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear();
        var today = (month + 1) + "/" + day + "/" + year;

        // This section creates the elements that store the weather information
        var cityDate = $("<h3>");
        var weatherIcon = $("<img>");
        var iconURL = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
        var currentTemp = $("<p>");
        var currentHumidity = $("<p>");
        var windSpeed = $("<p>");

        // This section adds the weather information to the above created elements and appends them to the page
        weatherIcon.attr("src", iconURL);
        cityDate.text(response.name + " (" + today + ") ");
        cityDate.append(weatherIcon);
        $("#current-weather").append(cityDate);
        currentTemp.text("Temperature: " + Math.floor(response.main.temp) + " °F");        
        currentHumidity.text("Humidity: " + response.main.humidity + "%");        
        windSpeed.text("Wind Speed: " + response.wind.speed + " MPH");
        $("#current-weather").append(currentTemp, currentHumidity, windSpeed);

        // This section pulls the lattitude and longitude from the response and uses that information to get the UV Index from the function
        lattitude = response.coord.lat;
        longitude = response.coord.lon;
        console.log(lattitude, longitude);
        uvIndex(lattitude, longitude);


    });
}

// This function pulls the 5 day forecast as well as every 3 hours for each of those days
function fiveDayWeather(city){
    $("#five-day").empty();


    var apiKey = "acb674f7dc9a574ba0b5c0ef2926ec4f"
    var queryURL = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=imperial";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){

        // This creates the header for the 5 day forecast as I did not want that on the page until a city was searched
        var forcastTitle = $("<h3>");
        var forecastDiv = $("<div>");
        forecastDiv.addClass("forecast")
        forcastTitle.text("5-Day Forecast:");
        $("#five-day").append(forcastTitle, forecastDiv);

        // This loop runs through each of the times for the response
        for (var i = 0; i < response.list.length; i++){

            // This statment finds the date time and starts looking at the 11th character, then searches for noon to pull only the 5 days once. After that it creates the elements for the content and appends it to the page
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

// This function is to grab the UV Index based on the lattitude and longitude of the searched city as it was not possible to pull it by the city name
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

        // This statement looks at the index number and changes the background color based on if it is favorable, moderate, or severe
        if (response.value < 3){
            uvValue.addClass("favorable");
        } else if (response.value > 2 && response.value < 8){
            uvValue.addClass("moderate");
            } else if (response.value > 7){
                uvValue.addClass("severe");
            }

    });
}

// This statemnt checks the local storage for the key of "City" and sees if the value is empty or not. This makes sure that on the page load, it will display nothing if the local storage is empty and it will display the correct weather information if the local storage has the key it is looking for
if (localStorage.getItem("City") !== null){
    currentWeather(localStorage.getItem("City"));
    fiveDayWeather(localStorage.getItem("City"));
}