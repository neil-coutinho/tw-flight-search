angular.module('twApp')
.directive('twFlightCard',[function(){

return{
 replace: true,
 restrict: 'E',
 scope:{
   flights: '=',
   mc: '='
 },
 templateUrl: 'assets/templates/directives/tw-flight-card.html',
 

}

}]);
