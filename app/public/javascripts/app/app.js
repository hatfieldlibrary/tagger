'use strict';

// load modules
var taggerApp = angular.module('taggerApp', [
  'ngMaterial',
    'ngFileUpload',
    'taggerControllers',
    'taggerServices',
    'taggerDirectives'
  ]
);



taggerApp.config(function($mdThemingProvider) {

  $mdThemingProvider.theme('default')
    .primaryPalette('indigo', {
      'default': '500', // by default use shade 400 from the pink palette for primary intentions
      'hue-1': '300', // use shade 100 for the <code>md-hue-1</code> class
      'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
      'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
    })
    .accentPalette('amber');

});

// manually bootstrap angular here

angular.element(document).ready(function() {
  try {
    angular.bootstrap(document, ['taggerApp']);
  } catch (e) {
    console.log(e);
  }
});
