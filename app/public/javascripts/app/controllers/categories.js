/*
 *
 *  CATEGORIES CONTROLLER
 *
 */
(function() {

  'use strict';

  taggerControllers.controller('CategoryCtrl', [

    '$rootScope',
    '$scope',
    'Category',
    'CategoryList',
    'CategoryUpdate',
    'TaggerToast',
    'TaggerDialog',
    '$animate',
    'Data',

    function(
      $rootScope,
      $scope,
      Category,
      CategoryList,
      CategoryUpdate,
      TaggerToast,
      TaggerDialog,
      $animate,
      Data ) {

      var vm = this;

      vm.Data = Data;
      vm.areas = Data.areas;
      vm.categories = Data.categories;
      // Dialog Messages
      vm.addMessage = 'templates/addCategoryMessage.html';
      vm.deleteMessage = 'templates/deleteCategoryMessage.html';

      // dialog
      vm.showDialog = function($event, message) {
        TaggerDialog($event, message);

      };

      // Set the selected category
      vm.resetCategory = function(id) {
        if (id !== null) {
          Data.currentCategoryIndex = id;
        }
        vm.category = Category.query({id: Data.currentCategoryIndex});

      };

      // Update category values
      vm.updateCategory = function() {
        var success = CategoryUpdate.save({
          id: $scope.category.id,
          title: $scope.category.title,
          description: $scope.category.description,
          areaId: $scope.category.areaId,
          linkLabel: $scope.category.linkLabel,
          url: $scope.category.url

        });
        success.$promise.then(function(data) {
          if (data.status === 'success') {
            vm.Data.categories = CategoryList.query();
            // Toast upon success
            TaggerToast("Category Updated");
          }
        })

      };

      // Watch for changes in Data singleton
      // category list
      $scope.$watch(function(scope) { return scope.Data.categories },
        function(newValue, oldValue) {
          $scope.categories = newValue;
        }

      );

      // area list
      $scope.$watch(function() { return Data.areas },
        function(newValue, oldValue) {
          $scope.areas = newValue;
          // init view
          init();

        }
      );

      // Listen for events from dialog -- should be unused
      $scope.$on('categoriesUpdate', function() {
        $scope.resetCategory(null);

      });

      var init = function() {
        vm.categories = CategoryList.query();
        vm.categories
          .$promise
          .then(function(data) {
            Data.categories = data;
            if (data.length > 0) {
              Data.currentCategoryIndex = data[0].id;
              resetCategory(data[0].id);
            }
          });
      };
    }

  ]);

})();

