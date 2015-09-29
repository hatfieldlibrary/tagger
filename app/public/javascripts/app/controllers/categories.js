/*
 *
 *  CATEGORIES CONTROLLER
 *
 */

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

    $scope.Data = Data;
    $scope.areas = Data.areas;
    $scope.categories = Data.categories;

    $scope.init = function() {
      $scope.categories = CategoryList.query();
      $scope.categories
        .$promise
        .then(function(data) {
          Data.categories = data;
          if (data.length > 0) {
            Data.currentCategoryIndex = data[0].id;
            $scope.resetCategory(data[0].id);
          }
        });

    };

    // Watch for changes in Data service
    $scope.$watch(function(scope) { return scope.Data.categories },
      function(newValue, oldValue) {
        $scope.categories = newValue;
      }
    );

    $scope.$watch(function() { return Data.areas },
      function(newValue, oldValue) {
        $scope.areas = newValue;
        // init view
        $scope.init();

      }
    );

    // Listen for events from dialog
    $scope.$on('categoriesUpdate', function() {

      $scope.resetCategory(null);

    });

    // Set new category to edit
    $scope.resetCategory = function(id) {

      if (id !== null) {
        Data.currentCategoryIndex = id;
      }
      $scope.category = Category.query({id: Data.currentCategoryIndex});

    };


    // Update category
    $scope.updateCategory = function() {

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
          $scope.Data.categories = CategoryList.query();
          // Toast upon success
          TaggerToast("Category Updated");
        }
      })

    };

    // dialogs
    $scope.showDialog = showDialog;
    function showDialog($event, message) {
      TaggerDialog($event, message);
    }

    // Dialog Messages
    $scope.addMessage = 'templates/addCategoryMessage.html';
    $scope.deleteMessage = 'templates/deleteCategoryMessage.html';


  }

]);
