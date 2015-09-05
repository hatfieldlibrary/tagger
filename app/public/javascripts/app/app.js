'use strict';

var app;

// load modules
var taggerApp = angular.module('taggerApp', [
  'ngMaterial',
    'taggerControllers',
    'taggerServices'
  ]
);

taggerApp.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('teal', {
      'default': '500', // by default use shade 400 from the pink palette for primary intentions
      'hue-1': '300', // use shade 100 for the <code>md-hue-1</code> class
      'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
      'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
    })
    .accentPalette('amber');

});

taggerApp.factory('Data', function() {
  return {
    areas: [],
    currentAreaIndex: 0
  };
});

// manually bootstrap angular here
angular.element(document).ready(function() {
  try {
    angular.bootstrap(document, ['taggerApp']);
  } catch (e) {
    console.log(e);
  }
});
