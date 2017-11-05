angular.module('twApp')
.directive('twFlightHeader',[function(){

return{
 replace: true,
 restrict: 'E',
 templateUrl: 'assets/templates/directives/tw-flight-header.html',

}

}]);
