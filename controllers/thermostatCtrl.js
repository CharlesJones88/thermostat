angular.module('thermostat').controller('thermostatCtrl', function($scope, $filter, moment, thermostatService, $interval, _, $uibModal, uiCalendarConfig) {
    var $ctrl = this;
    var MIN_TEMP = 60;
    var MAX_TEMP = 80;
    $scope.fanEnabled = false;
    $scope.current = 0;
    $scope.temperature = 0;
    $scope.heat = 'off';
    $scope.cool = 'off';
    $scope.fan = 'off';
    $scope.animationsEnabled = true;
    $scope.eventSources = {};
    $scope.events = [];

    $scope.uiConfig = {
        calendar: {
            editable: true,
            defaultView: 'agendaWeek',
            header: {
                left: 'agendaDay agendaWeek month',
                right: 'today prev,next'
            },
            dayClick: $scope.setCalDate,
            eventClick: $scope.alertOnEventClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize,
            eventRender: $scope.eventRender
        }
    };

    $scope.setCalDate = function(date, jsEvent, view) {
        var selectedDate = moment(date).format('YYYY-MM-DD');
        $scope.calendarDate[0].events[0].start = selectedDate;
        $scope.selectedDate = $filter('date')(selectedDate, 'yyyy-MM-dd');
    };

    $scope.calendarTab = 1;

    $scope.selectedCalTab = function(tab) {
        if(tab == 1) {
            $scope.calendarTab = 1;
        } else {
            $scope.calendarTab = 2;
        }
    };

    $scope.addEvent = function(temp) {
        $scope.add = true;
    };

    $scope.setEvent = function(event) {
        if(event.which === 13) {
            if(!isNaN(event.currentTarget.value)) {
                var number = parseInt(event.currentTarget.value);
                if(number < MIN_TEMP && number > MAX_TEMP) {
                    return;
                }
                var startDate = new Date();
                var endDate = new Date(startDate.getTime() + 30 * 60000);
                $scope.events.push({
                    title: event.currentTarget.value,
                    start: startDate,
                    end: endDate,
                    className: [event.currentTarget.value]
                });
                $scope.add = false;
            }
        }
    };

    $scope.remove = function(index) {
        $scope.events.splice(index,1);
    };

    $scope.alertOnEventClick = function() {
        console.log('Event clicked');
    };

    $scope.alertOnDrop = function() {
        console.log('Event drop');
    };

    $scope.alertOnResize = function() {
        console.log('Resized');
    };

    $scope.eventRender = function() {
        console.log('Rendered');
    };

    $('#calendar').fullCalendar({
        googleCalendarApiKey: '377181786583-bc76rduacr7qih5cdvs9g4dss767ba4k.apps.googleusercontent.com',
        events: {
            googleCalendarId: '3ju871auj8t058majd891s65o0@group.calendar.google.com'
        }
    });

    $scope.open = function() {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'modalContent.html',
            controller: 'thermostatCtrl'
        });
    };

    thermostatService.getState().then(function(data) {
        $scope.cool = thermostatService[data.data.states.cool];
        $scope.heat = thermostatService[data.data.states.heat];
        $scope.fan = thermostatService[data.data.states.fan];
    });

    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(thermostatService.onPositionUpdate);

    thermostatService.getCurrTemp().then(function(data) {
        $scope.current = data.data.currentTemp.toFixed(1);
    });
    
    thermostatService.getTemp().then(function(data) {
        $scope.temperature = data.data.temp;
    });

    thermostatService.getMode().then(function(data) {
        if(data.data.mode) {
            $scope.mode = data.data.mode;
        } else {
            $scope.mode = 'off';
        }
        $scope.prevMode = $scope.mode; 
    });

    var func = _.debounce(function() {
        thermostatService.setTemp($scope.temperature);
     }, 2000);

    $scope.tempUp = function() {
        if($scope.temperature <= MAX_TEMP) {
            ++$scope.temperature;
            func();
        }
    };

    $scope.tempDown = function() {
        if($scope.temperature >= MIN_TEMP) {
            --$scope.temperature;
            func();
        }
    };

    $scope.toggleMode = function() {
        if($scope.prevMode !== $scope.mode) {
            thermostatService.setMode($scope.mode);
        }
    };

    $scope.toggleFan = function() {
        thermostatService.setFanState($scope.fanEnabled);
    }

    $interval(function() {
        thermostatService.getCurrTemp().then(function(data) {
            $scope.current = data.data.currentTemp.toFixed(1);
        });
    }, 10000);
});
