angular.module('thermostat').service('thermostatService', function($http) {

    this.week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    this.running = ['off', 'on'];

    this.getState = function() {
        return $http.get('/state');
    }
    this.setTemp = function(temp) {
        return $http.post('/temp', {temp:temp});
    };

    this.getTemp = function() {
        return $http.get('/temp');
    };

    this.setMode = function(mode) {
        return $http.post('/mode', {mode:mode});
    };

    this.getMode = function() {
        return $http.get('/mode');
    };

    this.getCurrTemp = function() {
        return $http.get('/currentTemp');
    };

    this.setFanState = function(fanEnabled) {
        return $http.get('/fan', {fanEnabled:fanEnabled});
    };

    this.onPositionUpdate = function(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        //TODO: Move this to the service
        var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&sensor=true";
        $http.get(url).then(function(result) {
            var address = result.data.results[2].formatted_address;
            var url = 'https://forecast.io/embed/#lat=' + lat + '&lon=' + lng + '&name=' + address.split(', ')[0];
            document.getElementById('forecast_embed').src = url;
        });
    };
});
