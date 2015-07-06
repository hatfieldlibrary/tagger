/**
 * Created by mspalti on 6/6/14.
 */

describe('Collections Browse', function(){

  describe('CollectionsCtrl', function() {

    var scope,
      ctrl,
      mockCollections = [110,
        [{"id":61,"name":"Ailene B. Dunbar papers"}]
      ],
      mockTags = {test: 'item'};

    beforeEach(function(){
      this.addMatchers({
        toEqualData: function(expected) {
          return angular.equals(this.actual, expected);
        }
      });
    });
    beforeEach(module('collectionsApp'));
    beforeEach(module('collectionServices'));
    beforeEach(module('collectionAnimations'));
    beforeEach(inject(function ( $rootScope, $controller, Collections, TagInfo) {

      // The collectionsServices module uses ngResource.  Rather than mock
      // $httpbackend, use the jasmine spyOn method to detect service calls
      // and return mock data.  Must be set before the $controller that calls
      // two services on init: Collections and TagInfo.
      spyOn(Collections, 'query').andReturn(mockCollections);
      spyOn(TagInfo, 'query').andReturn(mockTags);
      scope = $rootScope.$new();
      ctrl = $controller('CollectionsCtrl', {$scope: scope });

    }));

    it ('should retrieve collection information and add collection object to scope', function() {
      expect(scope.collections).toEqualData(mockCollections);
    });

    it ('should retrieve tag information and add tagInfo object to scope', function() {
      expect(scope.tagInfo).toEqualData(mockTags);
    });


    it('should return true for finding aid', function() {
      expect(scope.isFindingAid('ead')).toEqual(true);
    });
  });

});

describe('Sub-Page Collections', function() {


  describe('DspaceCollectionsCtrl', function () {

    var scope,
      ctrl,
      mockCollections = [
        {name: 'Department of Anthropology'},
        {name: 'Department of Art History'}
      ];

    beforeEach(function () {
      this.addMatchers({
        toEqualData: function (expected) {
          return angular.equals(this.actual, expected);
        }
      });
    });
    beforeEach(module('collectionsApp'));
    beforeEach(module('collectionServices'));
    beforeEach(module('collectionAnimations'));
    beforeEach(inject(function ($rootScope, $controller, DspaceCollections) {
      spyOn(DspaceCollections, 'query').andReturn(mockCollections);
      scope = $rootScope.$new();
      ctrl = $controller('DspaceCollectionsCtrl', {$scope: scope});
    }));

    it('should create DSpace collections model 2 collections fetched from xhr', function () {

      expect(scope.dspaceCollections).toEqualData(mockCollections);

    });
  });

});
