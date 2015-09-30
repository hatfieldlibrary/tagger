
(function() {

  'use strict';

  taggerControllers.controller('AuthorizedCtrl', [
    function() {

      var vm = this;

      /** @type {string} */
      vm.role = '';

      /**
       * Sets the role of the user based on the
       * area to which they belong. Called on the
       * initial page load after successful authentication.
       * @param areaId the current area id
       */
      vm.getRole = function (areaId) {

        vm.role = getUserRole(areaId);

      };

      /**
       * Returns the user role based on the area id in their
       * user profile.
       * @param areaId
       * @returns string for role
       */
      function getUserRole(areaId) {

        if (areaId === 0) {
          return 'Administrator';
        } else {
          return 'Area Maintainer';
        }

      }
    }
  ]);

})();
