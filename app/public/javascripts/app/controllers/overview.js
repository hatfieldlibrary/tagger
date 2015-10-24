(function() {

  'use strict';
  /**
   * Controller for the area overview page.
   */
  taggerControllers.controller('OverviewCtrl', [
    '$scope',
    'CategoryByArea',
    'CategoryCountByArea',
    'ContentTypeCount',
    'Data',
    function(
      $scope,
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

        if (Data.currentAreaIndex !== null) {

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
            function (types) {
              var count = 0;
              var data = [];
              for (var i = 0; i < types.length; i++) {
                count = count + types[i].count;
              }
              for (var i = 0; i < types.length; i++) {
                data[i] = {title: types[i].name, value: types[i].count};
              }
              vm.typeCounts = {
                total: count,
                data: data
              }
            });

        }
      };

      /**
       * Watch for updates to the area label.  Assures changes in LayoutCtrl
       * are registered here.
       */
      $scope.$watch(function() { return Data.areaLabel},
        function() {
          vm.areaLabel = Data.areaLabel;
        });

      /**
       * Watch for changes in the shared area id and initialize
       * the view model.
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


