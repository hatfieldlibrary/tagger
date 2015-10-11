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
    'ContentTypeCount',
    'Data',
    function(
      $scope,
      CollectionsByArea,
      CategoryByArea,
      CategoryCountByArea,
      ContentTypeCount,
      Data) {

      var vm = this;

      vm.catgoryCounts = {};

     // vm.categoryChart = {
     //   total: 0,
     //   data: []
     // };


      var init = function() {

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

        var contentTypeCount = ContentTypeCount.query({areaId: Data.currentAreaIndex});
        contentTypeCount.$promise.then(function(types) {
          console.log('types');
          console.log(types);
          var count = 0;
          var data = [];
          for (var i = 0; i < types.length; i++) {
            count = count + types[i].count;
          }
          for (var i = 0; i < types.length; i++) {
            data[i] = {title: types[i].name, value: types[i].count};
            console.log(data[i]);
          }
          vm.typeCounts = {
            total: count,
            data: data
          }
        });
        vm.areaLabel = Data.areaLabel;

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

      $scope.$watch(function() {return Data.contentTypes})

    }
  ]);

})();


