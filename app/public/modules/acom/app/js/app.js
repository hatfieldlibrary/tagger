'use strict';

var app;

// load modules
var collectionsApp = angular.module('collectionsApp', [

  'ngRoute',
  'collectionAnimations',
  'collectionControllers',
  'collectionServices',
  'collectionDirectives',
  'collectionFilters'

]);


collectionsApp.config(['$httpProvider', function ($httpProvider) {

  var $http,
    interceptor = ['$q', '$injector', function ($q, $injector) {

      function success(response) {
        // get $http via $injector because of circular dependency problem
        $http = $http || $injector.get('$http');
        if($http.pendingRequests.length < 1 ) {

          $('#resultInfo').show();
          $('#loadingImage').hide();
        }
        return response;
      }

      function error(response) {
        // get $http via $injector because of circular dependency problem
        $http = $http || $injector.get('$http');
        if($http.pendingRequests.length < 1) {
          $('#resultInfo').hide();
          $('#loadingImage').hide();
        }
        return $q.reject(response);
      }

      return function (promise) {
        $('#resultInfo').hide();
        $('#loadingImage').show();
        return promise.then(success, error);
      };
    }];

  $httpProvider.interceptors.push(interceptor);

}]);

// routes
collectionsApp.config(['$routeProvider','$locationProvider',
  function($routeProvider, $locationProvider) {

    $routeProvider.

      when('/commons/collec/:id', {
        templateUrl: '/partials/collec/',
        reloadOnSearch: false
      }).
      when('/commons/all', {
        templateUrl: '/partials/filter/'
      }).
      when('/commons/partials/:name', {
        templateUrl: function(params) {
          return '/partials/' + params.name;
        }
      }).
      when('/commons/info/data/:name', {
        templateUrl: function(params) {
          return '/info/data/' + params.name;
        }
      }).
      when('/commons/info/student/:name', {
        templateUrl: function(params) {
          return '/info/student/' + params.name;
        }
      }).
      when('/commons/info/:name', {
        templateUrl: function(params) {
          return '/info/' + params.name;
        }
      }).when('/commons', {
        templateUrl: '/partials/home',
        reloadOnSearch: false
      });


    $locationProvider.html5Mode(true).hashPrefix('!');

  }]);

collectionsApp.factory('Data', function() {
  return {
    currentAreaIndex: 0,
    currentSubjectIndex: null,
    currentSubjectId: null,
    currentSubjectName: '',
    currentId: null,
    currentView: 'card',
    currentScrollPosition: null
  };
});

// This adds foundation 5 support and sets user agent
// after angular has been initialized.  (As we continue
// to develop with foundation, note this as a possible
// source of problems. Foundation for Apps is an attempt
// to integrate angular and foundation.)
// After config(), Angular calls run blocks on startup.
collectionsApp.run(function($rootScope) {

  $rootScope.$on('$viewContentLoaded', function () {
    // add init method
    app = (function(document, $) {
      var docElem = document.documentElement,
        _userAgentInit = function () {
          docElem.setAttribute('data-useragent', navigator.userAgent);
        },
        _init = function () {
          try {
            // initialize foundation
            $(document).foundation();
          } catch (err) {
            console.log(err.message);
          }
          _userAgentInit();
        };
      return {
        init: _init
      };
    })(document, jQuery);
    // call init
    (function() {
      app.init();
    })();
  });
});



// manually bootstrap angular here
angular.element(document).ready(function() {
  try {
    angular.bootstrap(document, ['collectionsApp']);
  } catch (e) {
    console.log(e);
  }
});


