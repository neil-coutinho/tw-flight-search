angular.module('twApp')
.factory('Flight',['$http', function FlightFactory($http){

  var apiUrl = 'http://airsewa.gov.in/api/Web/AKS_GetFlightSchedule';

  return {

    search: function(params){
      return $http({method: 'POST', url:apiUrl, data: params })
    }


  }


}]);
