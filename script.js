// Ajax Weather from OpenWeather.com
$(".search").on("click", function () {
    renderWeather();
    renderForecast();
});
$("#city").keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        renderWeather();
        renderForecast();
    }
});

var validCity = false;
var UVIqueryURL;

function renderWeather() {
    var APIKey = "166a433c57516f51dfab1f7edaed8413";
    var city = $("#city").val().trim();
    // Here we are building the URL we need to query the database
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&" +
        "q=" + city + "&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        validCity = true;
        console.log(response);
        renderCurrWeather(response);
    });
}



function renderCurrWeather(data) {
    $("#currWeather").css("display","block");
    $("#currWeather").html("");
    var APIKey = "166a433c57516f51dfab1f7edaed8413";
    var date = moment().format("MM/DD/YYYY");
    var cityName = data.name;
    var temperature = data.main.temp;
    var humidity = data.main.humidity;
    var windSpeed = data.wind.speed;
    var icon = data.weather[0].icon;
    var latitude = data.coord.lat;
    var longtitude = data.coord.lon;
    UVIqueryURL = "https://api.openweathermap.org/data/2.5/uvi?" +
        "lat=" + latitude + "&lon=" + longtitude + "&appid=" + APIKey;

    var cityDateDiv = "<h3 class='mb-2'>" + cityName + " " + "(" + date + ")" + "<img src='http://openweathermap.org/img/wn/" + icon + "@2x.png' alt='icon'/>" + "</h3>";
    $("#currWeather").append(cityDateDiv)
    var tempDiv = "<p>Temperature: " + temperature + " °F</p>";
    $("#currWeather").append(tempDiv);
    var humDiv = "<p>Humidity: " + humidity + "%</p>";
    $("#currWeather").append(humDiv);
    var windDiv = "<p>Wind Speed: " + windSpeed + " MPH</p>";
    $("#currWeather").append(windDiv);
    renderUVI(UVIqueryURL);
}


function renderUVI(queryURL) {
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var uvi = response.value;
        var backgroundColor;
        if (uvi <= 2) backgroundColor = "green";
        else if (uvi <= 5) backgroundColor = "orange";
        else if (uvi <= 8) backgroundColor = "pink";
        else backgroundColor = "red";
        var uviDiv = "<p id='uv'>UV Index: " + "<span id='uvnum' style='background-color: " + backgroundColor + "'>" + uvi + "</span>" + "</p>"
        $("#currWeather").append(uviDiv);
    });
}


function renderForecast() {
    $("#forecastTitle").css("display","block");
    $("#fivedays").html("");
    var APIKey = "166a433c57516f51dfab1f7edaed8413";
    var city = $("#city").val().trim();
    var forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&" +
        "q=" + city + "&appid=" + APIKey;

    $.ajax({
        url: forecastQueryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        for (var i = 1; i <= 5; i++) {
            var date = moment().add(i, "d").format("MM/DD/YYYY");
            var icon = response.list[i-1].weather[0].icon;
            var temp = response.list[i-1].main.temp;
            var humidity = response.list[i-1].main.humidity;
            var card = $("<div class='card p-2 bg-primary' style='width: 18%'>");
            var dateDiv = "<h6>"+date+"</h6>";
            card.append(dateDiv);
            var iconDiv = "<img src='http://openweathermap.org/img/wn/" + icon + "@2x.png' alt='icon'/>"
            card.append(iconDiv);
            var tempDiv = "<p>Temperature: " + temp + " °F</p>";
            card.append(tempDiv);
            var humDiv = "<p>Humidity: " + humidity + "%</p>";
            card.append(humDiv);
            $("#fivedays").append(card);
        }
    });
}


