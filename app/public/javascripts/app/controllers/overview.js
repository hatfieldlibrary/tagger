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
    'CategoryCountByArea',
    'Data',
    function(
      $scope,
      CollectionsByArea,
      CategoryByArea,
      CategoryCountByArea,
      Data) {

      var vm = this;

      vm.catgoryCounts = {};

      vm.categoryChart = {
        total: 0,
        data: []
      };

      vm.restricted = 0;
      vm.public = 0;

      var restrictedCount;

      var init = function() {

        restrictedCount = 0;
        var categoryCount = CategoryCountByArea.query({areaId: Data.currentAreaIndex});
        categoryCount.$promise.then(function (categories) {
          var catCount = 0;
          var data = [];
          for (var i = 0; i < categories.length; i++) {
            catCount = catCount + categories[i].count;
          }
          for (var i = 0; i < categories.length; i++) {
            data[i] = {title: categories[i].title, value: categories[i].count};
            console.log(data[i]);
          }
          vm.categoryCounts = {
            total: catCount,
            data: data
          }
        });
        vm.areaLabel = Data.areaLabel;
        vm.collections = CollectionsByArea.query({areaId: Data.currentAreaIndex});
        vm.collections.$promise.then(function (data) {
          for (var i = 0; i < data.length; i++) {
            console.log('restrict ');
            console.log(data[i].collection.restricted);
            if (data[i].collection.restricted !== false) {
              restrictedCount++;
            }
          }
          vm.restricted = restrictedCount;
          vm.public =  vm.collections.length - restrictedCount;
        });
      } ;

      init();

      $scope.$watch(function() {return Data.currentAreaIndex},
        function(newValue, oldValue){
              if (newValue !== oldValue) {
                init();
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


    }
  ]);

})();


