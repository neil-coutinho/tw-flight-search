'use strict';

angular.module('twApp',['ngRoute','ngResource','ui.bootstrap','localytics.directives','rzModule','angular-growl', 'LocalStorageModule'])

  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $locationProvider.hashPrefix('');

    $routeProvider.when('/', {redirectTo: '/search'})

    .when('/search',{
      templateUrl: 'assets/templates/index.html',
      controller: 'MainController'

    })

    .otherwise({redirectTo:'/'});


    $locationProvider.html5Mode('true');


  }])

  .config(['growlProvider', function(growlProvider) {
    growlProvider.globalPosition('bottom-left')
    .globalTimeToLive(5000)
    .globalDisableCountDown(true);
  }])

  .config(['localStorageServiceProvider', function(localStorageServiceProvider) {
    localStorageServiceProvider
    .setPrefix('tw'); //setting a prefix for my app local storage variables
  }]);
