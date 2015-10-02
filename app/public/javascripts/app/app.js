'use strict';

// load modules
angular.module('taggerApp', [

    'ngMaterial',
    'ngRoute',
    'ngFileUpload',
    'taggerControllers',
    'taggerServices',
    'taggerDirectives'

  ]
)
  // configure the route provider
  .config([
    '$routeProvider',
    '$locationProvider',
    function($routeProvider, $locationProvider) {

      $routeProvider.
        when('/partials/:name', {
          templateUrl: function(params) {
            return '/admin/partials/' + params.name;
          }
        }).when('/', {
          templateUrl: '/admin/partials/overview',
          reloadOnSearch: false
        }).otherwise({
          templateUrl: '/admin/partials/overview'
        });

      $locationProvider.html5Mode(true).hashPrefix('!');

    }]
)
  // configure the Angular Material theme
  .config( function($mdThemingProvider) {

    $mdThemingProvider.theme('default')
      .primaryPalette('indigo', {
        'default': '500', // by default use shade 400 from the pink palette for primary intentions
        'hue-1': '300', // use shade 100 for the <code>md-hue-1</code> class
        'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
        'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
      })
      .accentPalette('amber');

  }
).config(['$provide', function($provide) {

    var customDecorator = function($delegate) {
      var d3Service = $delegate;
      d3Service.d3().then(function(d3) {
        // build our custom functions on the d3
        // object here
      });
      return d3Service; // important to return the service
    };

    $provide.decorator('d3Service', customDecorator);

  }]);

// bootstrap angular
angular.element(document).ready(function() {
  try {
    angular.bootstrap(document, ['taggerApp']);
  } catch (e) {
    console.log(e);
  }
});
