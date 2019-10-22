// Ajax Weather from OpenWeather.com
$(".search").on("click", renderWeather);
$("#city").keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        renderWeather();
    }
});

var validCity = false;

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
    });
}


