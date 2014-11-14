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

// This adds foundation 5 support and sets user agent
// after angular has been initialized.  (As we continue
// to develop with foundation, note this as a possible
// source of problems.  At the moment, it's not clear
// what effect, if any, this is having.)
collectionsApp.run(function($rootScope) {

    $rootScope.$on('$viewContentLoaded', function () {

        // global
        app = (function(document, $) {
            var docElem = document.documentElement,
                _userAgentInit = function() {
                    docElem.setAttribute('data-useragent', navigator.userAgent);
                },
                _init = function() {
                    $(document).foundation();
                    _userAgentInit();
                };
            return {
                init: _init
            };
        })(document, jQuery);

        (function() {
            app.init();
        })();


    });
});



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

    $httpProvider.responseInterceptors.push(interceptor);

}]);


// routes
collectionsApp.config(['$routeProvider','$locationProvider',
    function($routeProvider, $locationProvider) {

        $routeProvider.
            when('/commons/collections/:id', {
                templateUrl: 'commons/partials/collections'
            }).
            when('/commons/collections/type/:id', {
                templateUrl: 'commons/partials/typecollections'
            }).
            when('/commons/collections', {
                templateUrl: 'commons/partials/collections'
            }).
            when('/commons/collection/byId/:id', {
                templateUlr: 'commons/partials.collection'
            }).
            when('/commons/archives', {
                templateUrl: 'commons/partials/archives'
            }).
            when ('/commons/home', {
                templateUrl: 'commons/partials/home'
            }).
            when ('/commons/archivesCollect/:id/:fld', {
                templateUrl: 'commons/partials/archivesCollect'
            }).
            when('/commons/archivesCollect/:id/:fld/:tag',{
                templateUrl: 'commons/partials/archivesCollect'
            }).
            when('/commons/community', {
                templateUrl: 'commons/partials/community'
            }).
            when('/commons/community-simple', {
            templateUrl: 'commons/partials/community-simple'
            }).
            when('/commons/records/:id/:query/:field', {
                templateUrl: 'commons/partials/records'
            }).
            when('/commons/special/:id/:query/:field', {
                templateUrl: 'commons/partials/special'
            }).
            when('/commons/political/:id/:query/:field', {
                templateUrl: 'commons/partials/political'
            }).
            when('/commons/pnaa/:id/:query/:field', {
                templateUrl: 'commons/partials/pnaa'
            }).
            when('/commons/hfma', {
                templateUrl: 'commons/partials/hfma'
            }).
            otherwise({
                templateUrl: 'commons/partials/home'
            });

      $locationProvider.html5Mode(true).hashPrefix('!');

    }]);


// manually bootstrap angular here
angular.element(document).ready(function() {
    try {
        angular.bootstrap(document, ['collectionsApp']);
    } catch (e) {
        console.log(e);
    }
});

