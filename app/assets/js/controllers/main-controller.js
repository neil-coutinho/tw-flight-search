angular.module('twApp').controller('MainController',['$scope', 'Flight','airportService', function($scope, Flight, airportService){

  $scope.mc = {
    activeTab: 1,
    startDate: new Date(),

    dateOptions : {
      maxDate: new Date(2018, 1, 22),
      minDate: new Date(),
      startingDay: 1,
      showWeeks: false,
    },
    datePopup: [{opened: false},{opened: false}]

  };

  $scope.airportList = [];

  //Get list of Indian airports for chosen search
  $scope.init = function() {
    airportService.get().$promise.then(function(data){
    $scope.airportList = _.filter(data,{country: 'India'});
      console.log($scope.airportList);
    });
  }

  //Grab search form data and get flights
  $scope.searchFlights = function() {


    console.log($scope.mc);

    var params = {
      "fromAirport":$scope.mc.fromCity,
      "toAirport":$scope.mc.toCity,
      "airlineCode":"",
      "OperationDate":$scope.mc.startDate,
      "fromTime":"",
      "toTime":""
    }
    params.OperationDate = moment($scope.mc.startDate).format('YYYY-MM-DD');

  Flight.search(params).then(
      function success(response){
        console.log(response);
      },
      function error(response){
        console.log('error');
        console.log(response)
      }
    );



  }

  //Simple date selector toggle function
  $scope.openDateSelector = function(datepicker){

    $scope.mc.datePopup[datepicker].opened = true;

  }


}]);
