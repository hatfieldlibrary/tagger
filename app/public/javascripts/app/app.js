'use strict';

var app;

// load modules
var taggerApp = angular.module('taggerApp', [
  'ngMaterial'
  ])
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('teal')
      .accentPalette('orange');
  });




// manually bootstrap angular here
angular.element(document).ready(function() {
  try {
    angular.bootstrap(document, ['taggerApp']);
  } catch (e) {
    console.log(e);
  }
});
