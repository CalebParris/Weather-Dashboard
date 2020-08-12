$("#search-btn").on("click", function(event){
    event.preventDefault();

    var inputCity = $("#input-city").val();

    var cityButton = $("<button>");
    cityButton.text(inputCity);
    cityButton.addClass("btn");
    $("#form-extraBtns").append(cityButton);
    $("#form-extraBtns").append($("<br>"));

    console.log(inputCity);

    $("#city-form").trigger("reset");
});