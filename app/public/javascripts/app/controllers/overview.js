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

      /**
       * Init function called on load and after change to
       * the selected area.
       */
      var init = function() {

        var categoryCount =
          CategoryCountByArea.query(
            {
              areaId: Data.currentAreaIndex
            }
          );
        categoryCount.$promise.then(
          function (categories) {
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

        var contentTypeCount =
          ContentTypeCount.query(
            {
              areaId: Data.currentAreaIndex
            }
          );
        contentTypeCount.$promise.then(
          function(types) {
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

      /**
       * Watch for changes in the shared area id and initalize
       * the view model in response.
       */
      $scope.$watch(function() {return Data.currentAreaIndex},
        function(newValue, oldValue){
          if (newValue !== oldValue) {

            init();
          }
        });

      // self-executing
      init();

    }
  ]);

})();


