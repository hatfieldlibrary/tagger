
(function() {

  'use strict';


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
          if (newValue !== null) {
            vm.tags = newValue;
            if (newValue.length > 0) {
              vm.resetTag(newValue[0].id);
            }
          }
        }
      );

    }]);



})();

