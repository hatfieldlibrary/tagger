'use strict';

var app;

// load modules
var taggerApp = angular.module('taggerApp', [
  'ngMaterial',
    'taggerControllers'
  ]
);

taggerApp.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('teal', {
      'hue-1': '900'
    });

});

// manually bootstrap angular here
angular.element(document).ready(function() {
  try {
    angular.bootstrap(document, ['taggerApp']);
  } catch (e) {
    console.log(e);
  }
});
