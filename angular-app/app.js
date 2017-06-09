(function(){
'use strict';

angular.module('SecimApp', ['ngMaterial', 'angular-loading-bar', 'ngAnimate', 
						 'ngRoute','secim.home','secim.cities', 'Secim.Parties'])
  	.config(['$mdThemingProvider', '$routeProvider', 'cfpLoadingBarProvider',
			function($mdThemingProvider, $routeProvider, cfpLoadingBarProvider)
			{
	  			$mdThemingProvider.theme('default').primaryColor('red').accentColor('blue');
	  			$routeProvider.otherwise({redirectTo: '/home'});
			}])
	
	.constant('CONFIG',{
		"apiUrl": 'http://secim.in/api-v1/',
	})

	.controller('AppCtrl', 
				['$scope', '$rootScope', 'CONFIG', '$mdSidenav', '$mdBottomSheet', '$log', 
				 function AppController($scope, $rootScope, CONFIG, $mdSidenav, $mdBottomSheet, $log ) 
				{
					$scope.toggleSidenav = toggleSideNav;
					$scope.selectMenu = selectMenu;
					$scope.selectedMenu = null;
					
					$rootScope.menuItems = [
						{ label: 'SEÇİM BÖLGELERİ', icon: 'place', url: 'cities'},
						{ label: 'PARTİLER', icon: 'flag', url: 'parties'},
						{ label: 'HABERLER', icon: 'my_library_books', url: 'news'},
						{ label: 'SEÇMENİN SESİ', icon: 'chat', url: 'news'},
					];
		
					/*---------------- Internal Functions -----------------------*/
					function toggleSideNav(name){
						$mdSidenav(name).toggle();
					}
					
					function selectMenu(itemIndex)
					{
						$scope.selectedMenu = itemIndex;
        				toggleSideNav('left');
					}
					
				}]);

})();
