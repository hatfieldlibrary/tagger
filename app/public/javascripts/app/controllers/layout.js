/*
 *
 *  TOP-LEVEL LAYOUT CONTROLLER
 *
 */

taggerControllers.controller('LayoutCtrl', [
  '$scope',
  'AreaList',
  'Data',
  function(
    $scope,
    AreaList,
    Data ) {

    $scope.Data = Data;
    $scope.areas = AreaList.query();
    $scope.areas.$promise.then(function(data) {
      Data.areas = data;
      Data.areaLabel = data[0].title;
      if (Data.currentAreaIndex === null) {
        Data.currentAreaIndex = $scope.areas[0].id;
      }

    });

    $scope.updateArea = function(id, index) {
      $scope.Data.currentAreaIndex = id;
      Data.currentAreaIndex = id;
      Data.areaLabel = Data.areas[index].title;
    };

    $scope.getRole = function(areaId) {
      Data.userAreaId = areaId;
      $scope.role = getUserRole(areaId);

    };

  }]);
