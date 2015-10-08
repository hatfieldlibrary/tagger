
(function() {

  'use strict';

  /**
   * The controller for collection area management.
   */
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

      var vm = this;


      /** @type {Array.<Object>} */
      vm.areas = [];

      /** @type {Object} */
      vm.area = Data.areas[0];

      /** @type {string} */
      vm.addMessage = 'templates/addAreaMessage.html';

      /** @type {string} */
      vm.deleteMessage = 'templates/deleteAreaMessage.html';

      /** @type {number */
      vm.currentAreaId = Data.currentAreaIndex;

      /**
       * Show the $mdDialog.
       * @param $event click event object (location of event used as
       *                    animation starting point)
       * @param message  html to display in dialog
       */
      vm.showDialog = function($event, message) {
        TaggerDialog($event, message);
      };


      /**
       * Sets the current area in view.
       * @param id  area id
       */
      vm.resetArea = function(id) {
        if (id !== null) {
          Data.currentAreaIndex = id;
          vm.currentAreaId = id;
        }
        var ar = AreaById.query({id: Data.currentAreaIndex});
         ar.$promise.then(function(data) {
           vm.area = data;
         });
      };

      /**
       *  Updates the area information.  Updates area list
       *  upon success.
       */
      vm.updateArea = function() {

        var success = AreaUpdate.save({
          id: vm.area.id,
          title: vm.area.title,
          description: vm.area.description,
          searchUrl: vm.area.areaId,
          linkLabel: vm.area.linkLabel,
          url: vm.area.url

        });
        success.$promise.then(function(data) {
          if (data.status === 'success') {
            vm.areas = AreaList.query();
            // Toast upon success
            TaggerToast("Area Updated");
          }
        })

      };


      /**
       * Watch for new areas in context.  Areas are added
       * and removed in the dialog controller.
       */
      $scope.$watch(function() { return Data.areas },
        function(newValue) {
          vm.areas = newValue;
        }
      );

      $scope.$watch(function() { return Data.currentAreaIndex},
        function(newValue) {
           vm.resetArea(newValue);
      });

    }]);


})();


