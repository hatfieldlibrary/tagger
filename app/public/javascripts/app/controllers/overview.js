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
    'Data',
    function(
      $scope,
      CollectionsByArea,
      Data) {

      var vm = this;

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

      vm.getRestrictedCount = function() {
        return restrictedCount;
      };

      vm.getPublicCount = function() {
        return vm.collections.length - restrictedCount;
      }


    }
  ]);

})();


