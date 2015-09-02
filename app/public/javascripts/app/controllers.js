
'use strict';

var taggerControllers = angular.module('taggerControllers', []);

taggerControllers.controller('TestCtrl',
  ['$scope',
    function($scope) {

    $scope.testData = {
       title: 'Chloe Clarke Willson journal ',
      description: 'The Chloe Clarke Willson journal documents Willson\'s journey aboard ' +
      'the ship Lausanne and her experiences as a Methodist missionary teacher at the Oregon Institute ' +
      '(later Willamette University) in Salem, Oregon.',
      dates: '1839-1849',
      count: '1',
      itemType: 'item',
      contentType: 'document',
      browseType: 'link',
      searchType: 'browse_only',
      category: 'This collection comes from the University Archives & Records collection area, which contains publications, images, administrative records, research materials, and scrapbooks dating from Willamette’s beginnings. ' +
      'Also available are materials relating to Freshman Glee, one of Willamette’s longest running – and most beloved – traditions. Use the link below to explore the many additional resource available to you in the University Archives collection.',
      restricted: "no",
      url: 'http://libmedia.willamette.edu/cview/archives.html#!doc:page:manuscripts/1645'
    };


  }]);
