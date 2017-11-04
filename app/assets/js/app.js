'use strict';

angular.module('twApp',['ngRoute', 'ui.bootstrap'])

  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $locationProvider.hashPrefix('');

    $routeProvider.when('/', {redirectTo: '/search'})

    .when('/search',{
      templateUrl: 'assets/templates/index.html',
      controller: 'MainController'

    })

    .otherwise({redirectTo:'/'});


    $locationProvider.html5Mode('true');


  }]);
