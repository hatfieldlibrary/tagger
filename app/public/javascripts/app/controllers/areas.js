/*
 *
 *  AREAS CONTROLLER
 *
 */

(function() {

  'use strict';

  taggerControllers.controller('AreaCtrl', [

    '$rootScope',
    '$scope',
    'AreaList',
    'AreaById',
    'AreaUpdate',
    'TaggerToast',
    'TaggerDialog',
    '$animate',
    'Data',

    function(
      $rootScope,
      $scope,
      AreaList,
      AreaById,
      AreaUpdate,
      TaggerToast,
      TaggerDialog,
      $animate,
      Data ) {

      $scope.Data = Data;
      $scope.areas = Data.areas;

      $scope.init = function() {
        $scope.areas = AreaList.query();
        $scope.areas
          .$promise
          .then(function (data) {
            $scope.Data.areas = data;
            if (data.length > 0) {
              Data.currentAreaIndex =  data[0].id;
              $scope.resetArea(data[0].id);
            }
          });
      };

      // Initialize view
      $scope.init();

      // Watch for changes in Data service
      $scope.$watch(function(scope) { return scope.Data.areas },
        function(newValue, oldValue) {
          $scope.areas = newValue;
        }
      );

      // Listen for events from dialog
      $scope.$on('areasUpdate', function() {

        $scope.resetArea(null);

      });

      // New area to edit
      $scope.resetArea = function(id) {

        if (id !== null) {
          Data.currentAreaIndex = id;
        }
        $scope.area = AreaById.query({id: Data.currentAreaIndex});

      };

      // Update area
      $scope.updateArea = function() {

        var success = AreaUpdate.save({

          id: $scope.area.id,
          title: $scope.area.title,
          description: $scope.area.description,
          searchUrl: $scope.area.areaId,
          linkLabel: $scope.area.linkLabel,
          url: $scope.area.url

        });

        success.$promise.then(function(data) {

          if (data.status === 'success') {
            $scope.areas = AreaList.query();
            // Toast upon success
            TaggerToast("Area Updated");
          }
        })

      };

      // dialogs
      $scope.showDialog = showDialog;
      function showDialog($event, message) {
        TaggerDialog($event, message);
      }

      // Area dialog messages
      $scope.addMessage = 'templates/addAreaMessage.html';
      $scope.deleteMessage = 'templates/deleteAreaMessage.html';

    }]);



})();


