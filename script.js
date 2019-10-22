// Ajax Weather from OpenWeather.com
$(".search").on("click", function () {
    renderWeather();
    renderUVI();
});
$("#city").keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        renderWeather();
        renderUVI();
    }
});

var validCity = false;
var latitude;
var longtitude;

function renderWeather() {
    var APIKey = "166a433c57516f51dfab1f7edaed8413";
    var city = $("#city").val().trim();
    //var city = "12";
    // Here we are building the URL we need to query the database
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&" +
        "q=" + city + "&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        validCity = true;
        console.log(response);
        latitude = response.coord.lat;
        longtitude = response.coord.lon;
        renderCurrWeather(response);
    });
}

function renderUVI() {
    var APIKey = "166a433c57516f51dfab1f7edaed8413";
    var city = $("#city").val().trim();
    //var city = "12";
    // Here we are building the URL we need to query the database
    var queryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?" +
    "lat="+latitude+"&lon="+longtitude+ "&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        validCity = true;
        console.log(response);
    });
}


function renderCurrWeather(data) {
    var date = moment().format("MM/DD/YYYY");
    var cityName = data.name;
    var temperature = data.main.temp;
    var humidity = data.main.humidity;
    var windSpeed = data.wind.speed;
    console.log(city);
    var cityDateDiv = "<h3 class='mb-4'>" + cityName + " " + "(" + date + ")" + "</h3>";
    $("#currWeather").append(cityDateDiv)
    var tempDiv = "<p>Temperature: " + temperature + " °F</p>";
    $("#currWeather").append(tempDiv);
    var humDiv = "<p>Humidity: " + humidity + "%</p>";
    $("#currWeather").append(humDiv);
    var windDiv = "<p>Wind Speed: " + windSpeed + " MPH</p>";
    $("#currWeather").append(windDiv);
}


