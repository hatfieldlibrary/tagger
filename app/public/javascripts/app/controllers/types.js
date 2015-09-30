/*
 *
 *  CONTENT TYPES CONTROLLER
 *
 */

(function() {

  'use strict';

  taggerControllers.controller('ContentCtrl', [

    '$rootScope',
    '$scope',
    '$animate',
    'TaggerToast',
    'TaggerDialog',
    'ContentTypeList',
    'ContentType',
    'ContentTypeUpdate',
    'ContentTypeDelete',
    'ContentTypeAdd',
    'Data',

    function(
      $rootScope,
      $scope,
      $animate,
      TaggerToast,
      TaggerDialog,
      ContentTypeList,
      ContentType,
      ContentTypeUpdate,
      ContentTypeDelete,
      ContentTypeAdd,
      Data) {

      $scope.Data = Data;
      $scope.contentTypes = Data.contentTypes;


      $scope.init = function() {

        $scope.contentTypes = ContentTypeList.query();
        $scope.contentTypes
          .$promise
          .then(function(data) {
            $scope.Data.contentTypes = data;
            if (data.length > 0) {
              console.log('init ' + data);
              $scope.resetType(data[0].id);
            }
          });

      };

      // Watch for changes in Data service
      $scope.$watch(function(scope) { return Data.contentTypes },
        function(newValue, oldValue) {
          $scope.contentTypes = newValue;
        }
      );

      $scope.$watch(function() { return Data.currentCategoryIndex },
        function() {
          $scope.init();
        }
      );

      // Listen event from dialogs
      $scope.$on('contentUpdate', function() {

        $scope.resetType(null);

      });

      // Reset content type to edi
      $scope.resetType = function(id) {

        if (id !== null) {
          Data.currentContentIndex = id;
        }
        console.log( $scope.Data.currentContentIndex);
        $scope.contentType = ContentType.query({id: Data.currentContentIndex});

      };


      // Update content type
      $scope.updateContentType = function() {

        var success = ContentTypeUpdate.save({

          id: $scope.contentType.id,
          name: $scope.contentType.name,
          icon: $scope.contentType.icon

        });

        success.$promise.then(function(data) {

          if (data.status === 'success') {
            $scope.Data.contentTypes = ContentTypeList.query();
            // Toast upon success
            TaggerToast("Content Type Updated");
          }
        })

      };

      // Dialogs
      $scope.showDialog = showDialog;
      function showDialog($event, message) {
        TaggerDialog($event, message);
      }


      // Dialog Messages
      $scope.addMessage = 'templates/addContentMessage.html';
      $scope.deleteMessage = 'templates/deleteContentMessage.html';

    }]);




})();
