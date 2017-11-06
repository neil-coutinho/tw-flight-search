angular.module('twApp').controller('MainController',['$scope', 'Flight','airportService', '$timeout', function($scope, Flight, airportService,$timeout){

  $scope.mc = {
    activeTab: 0, // One way or roundtrip
    returnView: false, //reset flag when shifting from roundtrip to one way
    startDate: new Date(),
    firstLoad: true, //inital  load flag
    dateOptions : {
      maxDate: new Date(2018, 1, 22),
      minDate: new Date(),
      startingDay: 1,
      showWeeks: false,
    },
    datePopup: [{opened: false},{opened: false}],
    searchResults: [],
    returnSearchResults:[],
    slider: {
      minValue: 0,
      maxValue: 10000,
      options:{
        floor: 0,
        ciel: 4500,
        step: 100,
        noSwitching: true,
        onEnd: function(id) {
          $scope.filterResults();
        }
      }
    }

  };

  $scope.airportList = [];



  //Get list of Indian airports for chosen search
  $scope.init = function() {
    airportService.get().$promise.then(function(data){
    $scope.airportList = _.filter(data,{country: 'India'});
      console.log($scope.airportList);
    });

    $scope.resizeSlider();

  }

  //Grab search form data and get flights
  $scope.searchFlights = function() {

    //validation
    if(!$scope.mc.pax > 0){
      console.log('Whoops! at least one passenger is required');
      return;
    }

    if(!$scope.mc.fromCity.code && !$scope.mc.toCity.code){
      console.log('Whoops! Please select a valid city');
      return;
    }
    console.log($scope.mc);

    var params = {
      "fromAirport":$scope.mc.fromCity.code,
      "toAirport":$scope.mc.toCity.code,
      "airlineCode":"",
      "OperationDate":$scope.mc.startDate,
      "fromTime":"",
      "toTime":""
    }
    params.OperationDate = moment($scope.mc.startDate).format('YYYY-MM-DD');

    $scope.mc.firstLoad = false;
    $scope.resizeSlider();

    Flight.search(params).then(

       function success(response){

         response = response.data;

         if(response.errFlag != 11){ //errFlag 11 = no flights found
           $scope.mc.searchResults = response.errJson.airlineList;
         } else {
           $scope.mc.searchResults = [];
         }

       console.log($scope.mc.searchResults);

        $scope.mc.searchResults = $scope.setRandomPrice($scope.mc.searchResults);

       if($scope.mc.activeTab == 1){
         console.log('get return flights');
         params = {
           "fromAirport":$scope.mc.toCity.code,
           "toAirport":$scope.mc.fromCity.code,
           "OperationDate":moment($scope.mc.returnDate).format('YYYY-MM-DD'),
           }
         $scope.mc.returnView = true;
         $scope.getReturnFlights(params);
       }

       },
       function error(response){
         console.log('error');
         console.log(response);
         $scope.mc.searchResults = [];
       }
     );



}


//Note: This is uncessary, ideally the api would be able to return both sets of data
$scope.getReturnFlights = function(params){
  console.log('get return flights');
  if(!params){
    return;
  }

  Flight.search(params).then(

     function success(response){

       response = response.data;

       if(response.errFlag != 11){ //errFlag 11 = no flights found
         $scope.mc.returnSearchResults = response.errJson.airlineList;
       } else {
         $scope.mc.returnSearchResults = [];
       }

     console.log($scope.mc.returnSearchResults);

     $scope.mc.returnSearchResults = $scope.setRandomPrice($scope.mc.returnSearchResults, 1);

     },
     function error(response){
       console.log('error');
       console.log(response);
       $scope.mc.returnSearchResults = [];
     }
   );

}








  //Simple date selector toggle function
  $scope.openDateSelector = function(datepicker){

    $scope.mc.datePopup[datepicker].opened = true;

  }


  //Filter search results on update of slider
  $scope.filterResults = function(){
      var min,max;
      min = $scope.mc.slider.minValue;
      max = $scope.mc.slider.maxValue;

      if(_.size($scope.mc.searchResults) > 0){

        _.each($scope.mc.searchResults, function(v,k){
            if(v.price > max || v.price < min) {
              $scope.mc.searchResults[k].hide = true;
            } else{
                $scope.mc.searchResults[k].hide = false;
            }
        });
      }


      if(_.size($scope.mc.returnSearchResults) > 0){

        _.each($scope.mc.returnSearchResults, function(v,k){
            if(v.price > max || v.price < min) {
              $scope.mc.returnSearchResults[k].hide = true;
            } else{
              $scope.mc.returnSearchResults[k].hide = false;
            }
        });
      }
  }

  //Resize slider
  $scope.resizeSlider = function() {
    $timeout(function(){
      $scope.$broadcast('rzSliderForceRender');
    })
  }


  //Set random prices to flights since we do not have price information

  $scope.setRandomPrice = function(list, returnFlightsArr) {

    var min,max;

    min = 2300;
    max = 9000;

    if(!list){
      return [];
    }

    if(_.size(list) == 0){
      return list;
    } else{


      _.each(list, function(v,k){

        list[k].price = Math.floor(Math.random() * (max - min + 1) + min);
        list[k].hide = false;

        if(returnFlightsArr ==1){ //Update from and to city (reverse if returnFlightsArr == 1)

          list[k].fromCity = $scope.mc.fromCity;
          list[k].toCity = $scope.mc.toCity;

        } else{
          list[k].fromCity = $scope.mc.fromCity;
          list[k].toCity = $scope.mc.toCity;
        }

      });

      return list;

    }
  }

  //On switching to one way trip mode reset view and remove return flight data
  $scope.resetReturnView = function(){
    $scope.mc.returnView = false;
    $scope.mc.returnSearchResults = [];
  }


}]);
