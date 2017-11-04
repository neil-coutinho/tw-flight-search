angular.module('twApp').controller('MainController',['$http', '$scope', function($http, $scope){

  $scope.mc = {
    activeTab: 1
  };


  $scope.init = function() {

    console.log('hello world');

    var params =
      {"fromAirport":"BOM","toAirport":"GOI","airlineCode":"","OperationDate":"04-Nov-2017","fromTime":"","toTime":""}


    $http({method: 'POST', url: "http://airsewa.gov.in/api/Web/AKS_GetFlightSchedule",data: params}).then(function(data){

      console.log(data);

    },function(data){

      console.log('error');
    });

  }

  //Grab search form data and get flights
  $scope.searchFlights = function() {
    console.log('Submitting data');

    console.log($scope.mc);

    var params = {
    "fromAirport":$scope.mc.fromCity,
    "toAirport":$scope.mc.toCity,
    "airlineCode":"",
    "OperationDate":$scope.mc.startDate,
    "fromTime":"",
    "toTime":""
  }


    $http({method: 'POST', url: "http://airsewa.gov.in/api/Web/AKS_GetFlightSchedule",data: params}).then(function(data){

      console.log(data);

    },function(data){

      console.log('error');
    });

  }


}]);
