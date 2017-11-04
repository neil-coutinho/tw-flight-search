angular.module('twApp')
.directive('twBookingForm',[function(){

return{
 replace: true,
 restrict: 'E',
 scope: {
   type: '='
 },
 templateUrl: 'assets/templates/directives/tw-booking-form.html',
 link: function(scope, element, attrs){
   console.log('inside my directive');
   console.log(scope);

 }

}

}]);
