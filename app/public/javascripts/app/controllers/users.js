
/*
 *
 *  USERS CONTROLLER
 *
 */

(function() {

  'use strict';

  taggerControllers.controller('UserCtrl', [
    '$scope',
    'UserList',
    'UserAdd',
    'UserUpdate',
    'UserDelete',
    'TaggerToast',
    'Data',
    function(
      $scope,
      UserList,
      UserAdd,
      UserUpdate,
      UserDelete,
      TaggerToast,
      Data ) {

     // var areaList = [];

      var vm = this;

      /** @type {Array.<Object>} */
      vm.areas = Data.areas;
      /** @type {Array.<Object>} */
      vm.users = [];

      /**
       * Adds empty new row to users.
       */
      vm.newRow = function() {
        vm.users[vm.users.length] = {id: null, name:'', email:'', area:''};
      };

      /**
       * Sets the current users list.
       */
      function setUsers() {
        var users = UserList.query();
        users.$promise.then(function(list) {
          var arr = [];
          if (list.length > 0) {
            for (var i = 0; i < list.length; i++) {
              arr[i] = {id: list[i].id, name: list[i].name, email: list[i].email, area: list[i].area};
            }
          }
          vm.users = arr;
        });
      }

      /**
       * Updates a user.
       * @param id
       * @param name
       * @param email
       * @param area
       */
      vm.updateUser = function(id, name, email, area) {

        if (id === null) {
          var result = UserAdd.save({name: name, email: email, area: area});
          result.$promise.then(function() {
            if (result.status === 'success') {
              TaggerToast('User Added');
              setUsers();
            }
          });
        } else {
          var result = UserUpdate.save({id: id, name: name, email: email, area: area});
          result.$promise.then(function() {
            if (result.status === 'success') {
              TaggerToast('User Updated');
              setUsers();
            }
          });
        }

      };

      /**
       * Deletes a user.
       * @param id  the user's id
       */
      vm.deleteUser = function(id) {

        var result = UserDelete.save({id: id});
        result.$promise.then(function() {
          if (result.status === 'success') {
            TaggerToast('User Deleted');
            setUsers();
          }
        });
      };

      setUsers();

      // Watch for changes on shared context object.
      /*
      vm.$watch(function() { return Data.areas },
       *
        function(newValue) {
          if (newValue.length > 0) {
            areaList[0] = {id: 0, name: 'Administrator'};
            for (var i = 0; i < newValue.length; i++) {
              areaList[i + 1] = {id: newValue[i].id, name: newValue[i].title};
            }
          }
        }
      );   */

    }
  ]);


})();

