'use strict';

var openstudioApp = angular.module('openstudioApp', [
  'ngAnimate',
  'ui.grid', 'ui.grid.edit',
  'ui.router', 'ui.router.stateHelper',
  'ui.bootstrap',
  'treeControl']);

openstudioApp.config(['$logProvider', '$urlRouterProvider', 'stateHelperProvider', function ($logProvider, $urlRouterProvider, stateHelperProvider) {
  $urlRouterProvider.when('', '/zones').otherwise('/zones');

  stateHelperProvider
    .state({
      name: 'zones',
      url: '/zones',
      controller: 'ZonesCtrl',
      templateUrl: 'partials/zones.html'
    })
    .state({
      name: 'systems',
      url: '/systems',
      controller: 'SystemsCtrl',
      templateUrl: 'partials/systems.html'
    });
}]);

openstudioApp.run(['$rootScope', '$log', 'Shared', 'os', function ($rootScope, $log, Shared, os) {
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    //$log.debug('Changing state', toState);
  });
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    //$log.debug('State change success');
  });
  $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    $log.error('Unhandled state change error:', error);
  });
  $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
    $log.error('State not found:', unfoundState.to);
  });
}]);

// For debugging, call bootlint()
var bootlint = (function () {
  var s = document.createElement("script");
  s.onload = function () {
    bootlint.showLintReportForCurrentDocument([]);
  };
  s.src = "https://maxcdn.bootstrapcdn.com/bootlint/latest/bootlint.min.js";
  document.body.appendChild(s)
});
