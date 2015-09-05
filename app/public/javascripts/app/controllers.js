
'use strict';

var taggerControllers = angular.module('taggerControllers', []);

taggerControllers.controller('CollectionCtrl',
  ['$scope', '$resource','CollectionsByArea','CollectionById','TagsForCollection','TypesForCollection', 'Data',
    function($scope, $resource, CollectionsByArea, CollectionById, TagsForCollection, TypesForCollection,  Data ) {


      $scope.getCollectionArea = function(id) {

        $scope.collectionList = CollectionsByArea.query({id: id});

      };


      $scope.init = function(id) {

        Data.currentAreaIndex = id;

        $scope.areas = Data.areas;

        $scope.collectionList = CollectionsByArea.query({id: id});

        $scope.collectionList.$promise.then(function(data) {

          $scope.getCollectionById(data[0].CollectionId);

          $scope.collectionTags = TagsForCollection
            .query({id: data[0].CollectionId});

          $scope.collectionTypes = TypesForCollection
            .query({id: data[0].CollectionId});

        });
      };

      $scope.getTagsForCollection = function(id) {
        $scope.collectionTags = TagsForCollection(id);
      };

      $scope.getCollectionById = function(id) {

        $scope.collection = CollectionById.query({id: id});

      };


      $scope.testData = {
        title: 'Chloe Clarke Willson journal ',
        description: 'The Chloe Clarke Willson journal documents Willson\'s journey aboard ' +
        'the ship Lausanne and her experiences as a Methodist missionary teacher at the Oregon Institute ' +
        '(later Willamette University) in Salem, Oregon. The Chloe Clarke Willson journal documents Willson\'s journey aboard ' +
        'the ship Lausanne and her experiences as a Methodist missionary teacher at the Oregon Institute ' +
        '(later Willamette University) in Salem, Oregon.',
        category: "Personal Collections",
        area: 'University Archives',
        dates: '1839-1849',
        count: '1',
        itemType: 'item',
        contentType: 'document',
        browseType: 'link',
        searchType: 'browse_only',
        restricted: "no",
        url: 'http://libmedia.willamette.edu/cview/archives.html#!doc:page:manuscripts/1645',
        thumbnail: 'http://libmedia.willamette.edu/resources/img/thumb/ChloeAureliaClarkeWillson.png',
        tags: ['cheese', 'rhubarb'],
        categories:['document', 'image']
      };

      $scope.init(5);

    }]);

taggerControllers.controller('LayoutCtrl', ['$scope', 'Data', 'AreaList', function($scope, Data, AreaList) {

  $scope.areas = AreaList.query();
  Data.areas = $scope.areas;

}]);
