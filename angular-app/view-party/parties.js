'use strict';

angular.module('Secim.Parties', ['ngRoute', 'ngResource', 'SecimApp'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/parties', {
    templateUrl: 'view-party/party-list.html',
    controller: 'PartyCtrl'
  });
}])
.factory("Parties", function($resource, CONFIG){
	//return $resource("http://secim.in/api-v1/taxonomy_term?parameters[vid]=3&pagesize=1")
	//return $resource("http://secim.in/api-v1/", {method:'cities'}, {'query': {method: 'GET', isArray: false }});
	return $resource("http://secim.in/api-v1/parties/",null,{'get':{method: 'GET', isArray: true}});
})
.controller('PartyCtrl', 
			['$scope', '$rootScope', '$filter', '$mdBottomSheet','Parties', 
			function($scope, $rootScope, $filter, $mdBottomSheet, Parties) 
			{
				//console.log(CONFIG.apiUrl);
				//View Scope Params
				$rootScope.title = "Siyasi Partiler";
				var orderBy = $filter('orderBy');

				$scope.openBottomSheet = function($event){
					$mdBottomSheet.show({
						templateUrl: 'view-home/bottom-sheet.html',
						controller: 'BottomSheetCtrl',
						targetEvent: $event
					}).then(function(clickedItem){
						if(clickedItem.order == "sortByName") {$scope.parties = orderBy($scope.parties, "party-long-name", false);}
						if(clickedItem.order == "sortByCount") {$scope.parties = orderBy($scope.parties, "profile-count", false);}
					});
				} 

				//Get Party list
				Parties.get(function(data){
					$scope.parties = data;
					/*
					angular.forEach($scope.parties, function (party) {
						party['profile-count'] = parseFloat(party['profile-count']);
					});
					*/ 
				});
	
			}])
.controller('BottomSheetCtrl', function($scope, $mdBottomSheet){
	$scope.items = [
		{ label: 'Alfabetik Sirala', icon: 'hangout', order: 'sortByName'},
		{ label: 'Aday Sayisi ile Sirala', icon: 'mail', order: 'sortByCount'},
	];
	
	$scope.listItemClick = function($index) {
    	var clickedItem = $scope.items[$index];
    	$mdBottomSheet.hide(clickedItem);
	};
});