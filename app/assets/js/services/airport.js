angular.module('twApp')
.service('airportService',['$resource',function($resource){

  this.get = function(){

    var airportList = $resource("assets/data/airports.json");
    return airportList.query();

  }

}]);
