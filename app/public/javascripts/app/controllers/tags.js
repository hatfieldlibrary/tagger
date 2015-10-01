
(function() {

  'use strict';

  // shared function
  var findArea = function(areaId, tar) {
    var targets = tar;
    for (var i = 0; i < targets.length; i++) {
      if (targets[i].AreaId === areaId) {
        return true;
      }
    }
    return false;
  };


  /**
   * Controller for managing subject tags.
   */
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

      var vm = this;

      /** @type {Array.<Object>} */
      vm.tags = Data.tags;
      /** @type {Object} */
      vm.tag = Data.tags[0];
      /** @type {number} */
      vm.currentTag = vm.tag.id;
      /* Tag dialog messages */
      /** @type {string} */
      vm.addMessage = 'templates/addTagMessage.html';
      /** @type {string} */
      vm.deleteMessage = 'templates/deleteTagMessage.html';

      /**
       * Show the $mdDialog.
       * @param $event click event object (location of event used as
       *                    animation starting point)
       * @param message  html to display in dialog
       */
      vm.showDialog = function ($event, message) {
        TaggerDialog($event, message);
      };

      /**
       * Reset the tag to the selected tag id. If the id is
       * non-null, set this to be the new current context tag id.
       * @param id the id of the newly chosen tag
       */
      vm.resetTag = function(id) {
        if (id !== null) {
          Data.currentTagIndex = id;
          vm.currentTag = id;
        }
        vm.tag = TagById.query({id:  Data.currentTagIndex});

      };

      /**
       * Updates tag information and retrieves new
       * tag list upon success.
       */
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

      /**
       * Watches for new tags in the shared context. This watch
       * should pick up area context changes and the updated tag list
       * after adding or deleting a tag.
       */
      $scope.$watch(function() { return Data.tags },
        function(newValue) {
          vm.tags = newValue;
          if (newValue.length > 0) {
            vm.resetTag(newValue[0].id);
          }
        }
      );

    }]);


  /**
   * Controller for adding and removing tags.
   */
  taggerControllers.controller('TagAreasCtrl', [

    '$scope',
    'TagTargets',
    'TagTargetRemove',
    'TagTargetAdd',
    'TaggerToast',
    'Data',

    function (
      $scope,
      TagTargets,
      TagTargetRemove,
      TagTargetAdd,
      TaggerToast,
      Data) {

      var vm = this;


      /** @type {Array.<Object>} */
      vm.areas = Data.areas;
      /** @type {Array.<Object>} */
      vm.areaTargets = [];

      /**
       * Retrieve the areas for the current tag.
       * @param id the id of the tag
       */
      vm.getCurrentAreaTargets = function (id) {
        vm.areaTargets = TagTargets.query({tagId: id});

      };

      /**
       * Test whether an area is in the list of areas selected
       * for this tag.  Uses the areaTargets array for the
       * test.
       * @param areaId the area id
       */
      vm.isChosen = function (areaId) {
        return findArea(areaId, vm.areaTargets);

      };

      /**
       * Update by associating adding or removing the association of
       * a tag with the provided content area.
       * @param areaId id of the area to be added or removed
       */
      vm.update = function (areaId) {

        if (vm.areaTargets !== undefined) {

          // If the area id is a already associated with tag,
          // remove that association
          if (findArea(areaId, vm.areaTargets)) {

            var result = TagTargetRemove.query(
              {
                tagId: Data.currentTagIndex,
                areaId: areaId
              }
            );
            result.$promise.then(function (data) {
              if (data.status == 'success') {
                vm.areaTargets = result.areaTargets;
                TaggerToast('Tag removed from area.')
              }
            });
          }
          // If the area id is a not associated with tag,
          // remove that association
          else {

            var result = TagTargetAdd.query(
              {
                tagId: Data.currentTagIndex,
                areaId: areaId
              }
            );
            result.$promise.then(function (data) {
              if (data.status == 'success') {
                vm.areaTargets = result.areaTargets;
                TaggerToast('Tag added to Area.')
              }
            });
          }
        }

      };

      /**
       * Watch updates the current list of area targets
       * when the current tag id changes.
       */
      $scope.$watch(function () {
          return Data.currentTagIndex
        },
        function (newValue) {
          if (newValue !== null) {
            vm.getCurrentAreaTargets(newValue);
          }
        }
      );

      /**
       * Watches the global list of areas and updates local
       * area list on change.
       */
      $scope.$watch(function () {
          return Data.areas
        },
        function (newValue) {
          vm.areas = newValue;
        });


    }]);


})();

