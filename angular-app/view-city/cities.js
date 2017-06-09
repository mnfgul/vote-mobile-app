'use strict';

angular.module('secim.cities', ['ngRoute', 'ngResource']);

angular.module('secim.cities').config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/cities', {
    templateUrl: 'view-city/city-list.html',
    controller: 'CityCtrl'
  });
}]);

angular.module('secim.cities').factory("Cities", function($resource){
	//return $resource("http://secim.in/api-v1/taxonomy_term?parameters[vid]=3&pagesize=1")
	//return $resource("http://secim.in/api-v1/", {method:'cities'}, {'query': {method: 'GET', isArray: false }});
	return $resource("http://secim.in/api-v1/cities/",null,{'get':{method: 'GET', isArray: true}});
});

angular.module('secim.cities').controller('CityCtrl', ['$scope', '$rootScope', 'Cities', function($scope, $rootScope, Cities) {
	//View Scope Params
	$rootScope.title = "Seçim Bölgeleri";

	console.log(Cities);

	//Get City list
	Cities.get(function(data){
		$scope.cities = data;
	});
	
}]);