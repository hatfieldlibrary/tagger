

taggerControllers.controller('OverviewCtrl', [
  '$scope',
  'CollectionsByArea',
  'Data',
  function($scope, CollectionsByArea, Data) {

    $scope.areaLabel = Data.areaLabel;
    $scope.collections = CollectionsByArea.query({areaId: Data.currentAreaIndex});
    var restrictedCount = 0;
    $scope.collections.$promise.then(function(data) {
      for (var i = 0; i < data.length; i++) {

        if (data[i].restricted !== true) {

          restrictedCount++;
        }
      }
    });

    $scope.getRestrictedCount = function() {
      return restrictedCount;
    };

    $scope.getPublicCount = function() {
      return $scope.collections.length - restrictedCount;
    }


  }
]);
