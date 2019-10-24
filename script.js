$(document).ready(function () {
    var UVIqueryURL;
    var searchHis = [];

    //initial the localstorage
    var tempHis = JSON.parse(localStorage.getItem("city"));
    if (tempHis !== null && tempHis.length > 0) {
        searchHis = tempHis;
    } else localStorage.setItem("city", JSON.stringify(searchHis));

    listHistory();

    // Ajax Weather from OpenWeather.com
    $(".search").on("click", function () {
        var city = $("#city").val().trim();
        renderWeather(city);
        //renderForecast();
    });
    $("#city").keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            var city = $("#city").val().trim();
            renderWeather(city);
            //renderForecast();
        }
    });

    //Trigger from the list of history
    $("#cityList").on("click", function () {
        var city = event.target.id.trim();
        renderWeather(city);
    });

    $(".close").on("click", function () {
        event.preventDefault();
        event.stopPropagation();
        var removeCityIdx = $(this).attr("data-value");
        searchHis.splice(removeCityIdx, 1);
        console.log(searchHis);
        localStorage.setItem("city", JSON.stringify(searchHis));
        event.target.parentElement.remove();
    });

    //trigger get current location
    $("#getlocation").on("click", geoFindMe);

    // render weather by geolocation
    function renderWeatherGeo(lat, lon) {
        var APIKey = "166a433c57516f51dfab1f7edaed8413";
        // Here we are building the URL we need to query the database
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&" +
            "&appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;

        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                console.log(response);
                renderCurrWeather(response);
                renderForecast(response.name);
                addHistory(response.name);
            });
    }


    // render weather by city name 
    function renderWeather(city) {
        var APIKey = "166a433c57516f51dfab1f7edaed8413";
        // Here we are building the URL we need to query the database
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&" +
            "q=" + city + "&appid=" + APIKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                console.log(response);
                renderCurrWeather(response);
                renderForecast(response.name);
                addHistory(response.name);
            })
            .fail(function () {
                alert("The City You Entered is not Valid!!!");
            });
    }

    //render current date weather
    function renderCurrWeather(data) {
        $("#currWeather").css("display", "block");
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

    //render current date uv index
    function renderUVI(queryURL) {
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
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

    //render 5 days forecast from today
    function renderForecast(city) {
        $("#forecastTitle").css("display", "block");
        $("#fivedays").html("");
        var APIKey = "166a433c57516f51dfab1f7edaed8413";
        //var city = $("#city").val().trim();
        var forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&" +
            "q=" + city + "&appid=" + APIKey;

        $.ajax({
            url: forecastQueryURL,
            method: "GET"
        }).then(function (response) {
            for (var i = 1; i <= 5; i++) {
                var date = moment().add(i, "d").format("MM/DD/YYYY");
                var icon = response.list[i - 1].weather[0].icon;
                var temp = response.list[i - 1].main.temp;
                var humidity = response.list[i - 1].main.humidity;
                var card = $("<div class='card p-2 bg-primary' style='width: 18%'>");
                var dateDiv = "<h6>" + date + "</h6>";
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

    //add to the history list
    function addHistory(name) {
        if (!searchHis.includes(name)) { //not duplicated
            searchHis.push(name);
            searchHis.sort(); // sort by first letter
            localStorage.setItem("city", JSON.stringify(searchHis));
            $("#cityList").html("");
            listHistory();
        }
    }

    // list out the history
    function listHistory() {
        searchHis.sort();
        for (var i = 0; i < searchHis.length; i++) {
            var listDiv = "<li class='list-group-item' id='" + searchHis[i] + "'>" + searchHis[i] + "<span aria-hidden='true' class='close' data-value ='" + i + "'>&times;</span>" + "</li>";
            $("#cityList").append(listDiv);
        }
    }


    //geoLocation 
    geoFindMe();
    function geoFindMe() {
        function success(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            renderWeatherGeo(latitude, longitude);
        }

        function error() {
            alert('Unable to retrieve your location');
        }

        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
        } else {
            navigator.geolocation.getCurrentPosition(success, error);
        }

    }

});


