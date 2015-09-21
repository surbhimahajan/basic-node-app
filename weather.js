var http = require("http");
var zipCode = "94536";

function printMessage(zipCode, date, high, low) {
    var message = "Weather report for " + zipCode + " on " + date + " is " + high + " high and " + low + " low";
    console.log(message);
}

function printErrorMessage(error) {
    console.error(error.message);
}
var request = http.get("http://query.yahooapis.com/v1/public/yql?q=select%20item%20from%20weather.forecast%20where%20location%3D" + zipCode + "&format=json",
    function(response) {
        var body = "";
        response.on('data', function(chunk) {
            body += chunk;
        });
        response.on('end', function() {
            if (response.statusCode === 200) {
                try {
                    var weather = JSON.parse(body);
                    console.log(weather.query.results.channel.item.forecast.length);
                    for (var i in weather.query.results.channel.item.forecast) {
                        printMessage(zipCode, weather.query.results.channel.item.forecast[i].date, weather.query.results.channel.item.forecast[i].high, weather.query.results.channel.item.forecast[i].low);
                    }
                } catch (error) {
                    //parse the error
                    printErrorMessage(error);
                }
            } else {
                printErrorMessage({
                    message: "There was an error getting the weather report for " + zipCode + ". (" + http.STATUS_CODES[response.statusCode] + ")"
                });
            }
        })
    });
