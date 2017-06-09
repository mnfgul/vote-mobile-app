'use strict';

angular.module('secim.home', ['ngRoute', 'ngMdIcons'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'view-home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$rootScope', function($rootScope) {
	//View Scope Params
	$rootScope.title = "Seçim 2015";
	
}]);