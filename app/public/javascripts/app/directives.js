'use strict';

var taggerDirectives  = angular.module('taggerDirectives', []);

taggerDirectives.directive('dialogBox', function() {

  return {
    restrict: 'E',
    scope: {},
    controller: 'CollectionsCtrl',
    transclude: true,
    templateUrl: '/components/collections.html'
  };
});
