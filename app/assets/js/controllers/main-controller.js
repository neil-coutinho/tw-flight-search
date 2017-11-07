angular.module('twApp').controller('MainController',['$scope', 'Flight','airportService', '$timeout', 'growl','localStorageService',function($scope, Flight, airportService,$timeout, growl,localStorageService){

  $scope.mc = {
    activeTab: 0, // One way or roundtrip
    returnView: false, //reset flag when shifting from roundtrip to one way
    startDate: new Date(),
    firstLoad: true, //inital  load flag
    loading: false, //flag = true when api call is made
    dateOptions : {
      maxDate: new Date(2018, 1, 22),
      minDate: new Date(),
      startingDay: 1,
      showWeeks: false,
    },
    datePopup: [{opened: false},{opened: false}],
    searchResults: [],
    returnSearchResults:[],
    fromCity: {},
    toCity: {},
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

      if(localStorageService.isSupported) { //load localstorage cities

          var fromCity, toCity, index;

          fromCity = $scope.getLocalStorageItem('fromAirport');
          toCity = $scope.getLocalStorageItem('toAirport');

              if(fromCity){
                fromCity = JSON.parse(fromCity);
                index = -1;
                index = _.findIndex($scope.airportList, {code: fromCity.code});

                if(index!= -1){

                  $scope.mc.fromCity = $scope.airportList[index];
                }

              }
              if(toCity){
                toCity = JSON.parse(toCity);

                index = -1;
                index = _.findIndex($scope.airportList, {code: toCity.code});

                if(index!= -1){

                  $scope.mc.toCity = $scope.airportList[index];
                }

              }





       }

    }, function(){
        growl.error('Whoops! Server error. Please try again after some time.');
    });

    $scope.resizeSlider();

  }

  //Grab search form data and get flights
  $scope.searchFlights = function() {

    //validation

    if(!$scope.mc.fromCity && !$scope.mc.toCity){
      growl.error('Whoops! Please select a valid city.');
      return;
    }

    if(!$scope.mc.pax > 0){
      growl.error('Whoops! Please enter the number of passengers (between 1 and 10).');
      return;
    }



    var params = {
      "fromAirport":$scope.mc.fromCity.code,
      "toAirport":$scope.mc.toCity.code,
      "OperationDate":$scope.mc.startDate,
    }
    params.OperationDate = moment($scope.mc.startDate).format('YYYY-MM-DD');

    $scope.mc.firstLoad = false;
    $scope.mc.loading = true;
    $scope.resizeSlider();

    $scope.setLocalStorage('fromAirport', JSON.stringify($scope.mc.fromCity));
    $scope.setLocalStorage('toAirport', JSON.stringify($scope.mc.toCity));

    Flight.search(params).then(

       function success(response){

         response = response.data;

         if(response.errFlag != 11){ //errFlag 11 = no flights found
           $scope.mc.searchResults = response.errJson.airlineList;
         } else {
           $scope.mc.searchResults = [];
         }



        $scope.mc.searchResults = $scope.setRandomPrice($scope.mc.searchResults);

        $scope.filterResults();

       if($scope.mc.activeTab == 1){

         params = {
           "fromAirport":$scope.mc.toCity.code,
           "toAirport":$scope.mc.fromCity.code,
           "OperationDate":moment($scope.mc.returnDate).format('YYYY-MM-DD'),
           }
         $scope.mc.returnView = true;
         $scope.getReturnFlights(params);
       } else{

           $scope.mc.loading = false;
       }

       },
       function error(response){
        // console.log('error');
         console.log(response);
         $scope.mc.searchResults = [];
         $scope.mc.loading = false;
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

     //console.log($scope.mc.returnSearchResults);

     $scope.mc.returnSearchResults = $scope.setRandomPrice($scope.mc.returnSearchResults, 1);

     $scope.filterResults();

     $scope.mc.loading = false;

     },
     function error(response){
      // console.log('error');
       console.log(response);
       $scope.mc.returnSearchResults = [];
       $scope.mc.loading = false;
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


  //Set random prices and a few defaults to flights since we do not have price information

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

        list[k].arrivalTime = moment(v.arrivalTime).format('hh:mm A');
        list[k].departureTime = moment(v.departureTime).format('hh:mm A');

        if(returnFlightsArr ==1){ //Update from and to city (reverse if returnFlightsArr == 1)

          list[k].fromCity = $scope.mc.toCity;
          list[k].toCity = $scope.mc.fromCity;

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


  //Set local storage
  $scope.setLocalStorage = function(key, val){
    console.log(key);
    console.log(val);
    return localStorageService.set(key, val);

  }


  //Get local storage item by key
  $scope.getLocalStorageItem = function(key){

    return localStorageService.get(key);

  }

}]);
