
/*
 *
 *  TAGS CONTROLLER
 *
 */

(function() {

  'use strict';

  taggerControllers.controller('TagCtrl', [

    '$rootScope',
    '$scope',
    '$animate',
    'TagList',
    'TagById',
    'TagUpdate',
    'TaggerToast',
    'TaggerDialog',
    'Data',

    function(
      $rootScope,
      $scope,
      $animate,
      TagList,
      TagById,
      TagUpdate,
      TaggerToast,
      TaggerDialog,
      Data  ) {

      var vm = self;
      vm.Data = Data;
      vm.tags = TagList.query();
      // Tag dialog messages
      vm.addMessage = 'templates/addTagMessage.html';
      vm.deleteMessage = 'templates/deleteTagMessage.html';
      // Tag dialogs
      vm.showDialog = function ($event, message) {
        TaggerDialog($event, message);
      };


      // Listen for event from dialog update
      $scope.$on('tagsUpdate', function() {
        vm.Data.tags = Data.tags;
        vm.resetTag(null);

      });

      // Reset item to edit
      vm.resetTag = function(id) {
        if (id !== null) {
          Data.currentTagIndex = id;
        }
        vm.tag = TagById.query({id:  Data.currentTagIndex});

      };

      // Update tag
      vm.updateTag = function() {
        var success = TagUpdate.save({
          id: vm.tag.id,
          name: vm.tag.name

        });
        success.$promise.then(function(data) {
          if (data.status === 'success') {
            vm.tags =TagList.query();

            // Toast upon success
            TaggerToast("Tag Updated");
          }
        })

      };

      // Watch for changes in Data service
      $scope.$watch(function() { return Data.tags },
        function(newValue, oldValue) {

          vm.tags = newValue;
        }
      );

      var init = function() {
        var tags = TagList.query();
        tags
          .$promise
          .then(function (data) {
            alert('new tags');
            Data.tags = data;
            if (data.length > 0) {
              vm.resetTag(data[0].id);
            }
          });

      };

    }]);

  /*
   *
   *  TAG AREA CONTROLLER
   *
   */

  taggerControllers.controller('TagAreasCtrl', [

    '$scope',
    'TagTargets',
    'TagTargetRemove',
    'TagTargetAdd',
    'FindAreaById',
    'TaggerToast',
    'Data',

    function (
      $scope,
      TagTargets,
      TagTargetRemove,
      TagTargetAdd,
      TaggerToast,
      FindAreaById,
      Data) {

      var vm = self;
      vm.areas = Data.areas;
      vm.areaTargets = [];

      vm.getCurrentAreaTargets = function (id) {
        vm.areaTargets = TagTargets.query({tagId: id});

      };

      vm.isChosen = function (areaId) {
        return FindAreaById(areaId, $scope.areaTargets);

      };

      vm.update = function (areaId) {
        if (vm.areaTargets !== undefined) {

          // If the area id of the selected checkbox is a
          // aleady a target, then delete the area target.
          if (FindAreaById(areaId, $scope.areaTargets)) {

            var result = TagTargetRemove.query({tagId: Data.currentTagIndex, areaId: areaId});

            result.$promise.then(function (data) {
              if (data.status == 'success') {
                vm.areaTargets = result.areaTargets;
                TaggerToast('Tag removed from area.')
              }
            });
          }
          // If the area id of the selected item is
          // not a target already, add a new area target.
          else {
            var result = TagTargetAdd.query({tagId: Data.currentTagIndex, areaId: areaId});

            result.$promise.then(function (data) {
              if (data.status == 'success') {
                vm.areaTargets = result.areaTargets;
                TaggerToast('Tag added to Area.')
              }
            });
          }
        }

      };

      $scope.$watch(function () {
          return Data.currentTagIndex
        },
        function (newValue, oldValue) {
          if (newValue !== null) {
            vm.getCurrentAreaTargets(newValue);
          }
        }
      );

      $scope.$watch(function () {
          return Data.areas
        },
        function (newValue) {
          vm.areas = newValue;
        });


    }]);


})();

