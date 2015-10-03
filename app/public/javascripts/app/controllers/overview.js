/*
 * OVERVIEW CONTROLLER
 */

(function() {

  'use strict';
  /**
   * Controller for the area overview page.
   */
  taggerControllers.controller('OverviewCtrl', [
    '$scope',
    'CollectionsByArea',
    'CategoryByArea',
    'TestData',
    'CategoryCountByArea',
    'Data',
    function(
      $scope,
      CollectionsByArea,
      CategoryByArea,
      TestData,
      CategoryCountByArea,
      Data) {

      var vm = this;

      vm.catgoryCounts = {};

      vm.TestData = {
        total: 13,
        data: [{title: 'cat one', value: 6} , {title: 'cat two', value: 4 }, {title: 'cat three', value: 3}]
      };

      vm.categoryChart = {
        total: 0,
        data: []
      };
      var categoryCount = CategoryCountByArea.query({areaId: Data.currentAreaIndex});
      categoryCount.$promise.then(function(categories) {
        console.log(categories);
        var catCount = 0;
        for (var i = 0; i < categories.length; i++) {
            catCount = catCount + categories[i].count;

        }
        vm.categoryCounts = {
          total: catCount,
          data: categories
        }
      });

        vm.areaLabel = Data.areaLabel;
      vm.collections = CollectionsByArea.query({areaId: Data.currentAreaIndex});
      var restrictedCount = 0;
      vm.collections.$promise.then(function(data) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].restricted !== true) {
            restrictedCount++;
          }
        }

      });

      $scope.$watch( function() {return Data.categoriesForArea},
        function(data) {
              if (data !== null) {
                if (data.length > 0) {
                    vm.categoryChart.total = data.length;
                  var categories = [];
                  for (var i = 0; i < data.length; i++) {
                      categories[i] = {title: data.title, count: data.count}
                  }
                }
              }
        });

      vm.getRestrictedCount = function() {
        return restrictedCount;
      };

      vm.getPublicCount = function() {
        return vm.collections.length - restrictedCount;
      }


    }
  ]);

})();


