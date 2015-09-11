
'use strict';

var taggerControllers = angular.module('taggerControllers', []);



// Top level layout controller.
taggerControllers.controller('LayoutCtrl', ['$scope', 'Data', 'AreaList', function($scope, Data, AreaList) {

  $scope.areas = AreaList.query();
  Data.areas = $scope.areas;

}]);



// Collections controller
taggerControllers.controller('CollectionCtrl', [

  '$scope',
  '$resource',
  'CollectionsByArea',
  'CollectionById',
  'TagsForCollection',
  'TypesForCollection',
  'Data',

  function(
    $scope,
    $resource,
    CollectionsByArea,
    CollectionById,
    TagsForCollection,
    TypesForCollection,
    Data ) {


    $scope.getCollectionArea = function(id) {

      $scope.collectionList = CollectionsByArea.query({id: id});

    };

    // Initialization method called on load.
    $scope.init = function(id) {

      Data.currentAreaIndex = id;
      $scope.areas = Data.areas;
      $scope.collectionList = CollectionsByArea.query({id: id});
      $scope.collectionList.$promise.then(function(data) {

        $scope.getCollectionById(data[0].CollectionId);
        $scope.collectionTags = TagsForCollection
          .query({id: data[0].CollectionId});
        $scope.collectionTypes = TypesForCollection
          .query({id: data[0].CollectionId});

      });
    };

    $scope.getTagsForCollection = function(id) {

      $scope.collectionTags = TagsForCollection(id);

    };

    $scope.getCollectionById = function(id) {

      $scope.collection = CollectionById.query({id: id});

    };


    $scope.showDialog = showDialog;

    // ANGULAR MATERIAL DIALOG SERVICE.

    // Internal showDialog method.
    // Based on Angular Material dialog example.
    function showDialog($event, message) {

      var parentEl = angular.element(document.body);
      // Show a dialog with the specified options.
      $mdDialog.show({
        parent: parentEl,
        targetEvent: $event,
        template: message,
        controller: DialogController
      });

      // The mdDialog service runs in an isolated scope.
      // It should be possible to use the mdDialog service and it's
      // inner controller with the multiple controllers in this project.
      // However, each context will require unique methods and events.
      // At least initially, let's create separate local controllers
      // and dialog services for each of the otter controllers.
      // Once complete, perhaps merge into a single member function.
      function DialogController($rootScope, $scope, $mdDialog, CategoryAdd, CategoryList, Data) {

        $scope.Data = Data;

        $scope.deleteCategory = function(id) {

          var result = CategoryDelete.save({id: id});

          result.$promise.then(function(data) {
            if (data.status === 'success') {

              toast("Category Deleted");
              // $scope.getCategoryList();
              // after retrieving new category list, we need
              // to update the category currently in view.
              $scope.getCategoryListAndUpdate();
              $scope.closeDialog();

            }

          });

        };

        $scope.addCategory = function(title) {

          var result = CategoryAdd.save({title: title});

          result.$promise.then(function(data) {

            if (data.status === 'success') {
              toast("Category Added");
              $scope.getCategoryList(data.id);
              $scope.closeDialog();

            }

          });
        };

        $scope.getCategoryList = function(id) {

          // update Data service
          Data.categories  = CategoryList.query();
          // broadcast event from rootScope so that
          // CategoryCtrl will update list with the
          // new category.
          Data.categories.$promise.then(function () {

            $rootScope.$broadcast('categoriesUpdate', {categories: Data.categories, id: id });

          });

        };


        $scope.closeDialog = function() {
          $mdDialog.hide();
        }

      }
    }

    // Using the Angular Material toast service.
    // As written, this function requires read/write access
    // to the scope object.  It's not obvious how one might
    // call this method from multiple controllers.  So this
    // appears where needed.
    function toast(content) {

      $scope.toastPosition = {
        bottom: false,
        top: true,
        left: false,
        right: true
      };

      $scope.getToastPosition = function () {
        return Object.keys($scope.toastPosition)
          .filter(function (pos) {
            return $scope.toastPosition[pos];
          })
          .join(' ');
      };

      $mdToast.show(
        $mdToast.simple()
          .content(content)
          .position($scope.getToastPosition())
          .hideDelay(3000)
      );

    }

    $scope.init(5);

  }]);





// Areas controller
taggerControllers.controller('AreaCtrl', [

  '$rootScope',
  '$scope',
  'AreaList',
  'AreaById',
  'AreaAdd',
  'AreaDelete',
  'AreaUpdate',
  '$mdDialog',
  '$mdToast',
  '$animate',
  'Data',

  function(
    $rootScope,
    $scope,
    AreaList,
    AreaById,
    AreaAdd,
    AreaDelete,
    AreaUpdate,
    $mdDialog,
    $mdToast,
    $animate,
    Data ) {

    $scope.Data = Data;

    // Area initialization, called on load.
    $scope.init = function() {
      $scope.areas = AreaList.query();
      $scope.areas
        .$promise
        .then(function (data) {
          console.log(data);
          $scope.Data.areas = data;
          if (data.length > 0) {
            Data.currentAreaIndex = data[0].id;
            $scope.resetArea(data[0].id);
          }
        });
    };


    // Listener.
    $scope.$on('areasUpdate', function(event, data) {

      console.log(data);
      $scope.areas = Data.areas;
      $scope.resetArea(data.id);

    });

    // Retrieves new area.
    $scope.resetArea = function(id) {

      console.log('requesting new area ' + id);
      $scope.Data.areaId = id;
      $scope.area = AreaById.query({id: id});

    };

    // Update the Area fields.
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
          // Toast upon success
          toast("Area Updated");
        }
      })

    };


    // Area dialog messages
    $scope.addMessage =
      '<md-dialog aria-label="Area dialog" style="width: 450px;">' +
      '  <md-dialog-content>'+
      '    <h3 class="md-display-1">New Area</h3>' +
      '      <md-input-container class="md-default-theme md-input-has-value">'  +
      '         <label for="input_4">Name</label><input type="text" ng-model="area.title" class="ng-pristine ng-valid md-input ng-touched" id="input_4" tabindex="0" aria-invalid="false" style="">'  +
      '       </md-input-container>'  +
      '  </md-dialog-content>' +
      '  <div class="md-actions">' +
      '    <md-button ng-click="closeDialog()" class="md-primary">' +
      '      Cancel' +
      '    </md-button>' +
      '    <md-button ng-click="addArea(area.title)" class="md-primary">' +
      '      Add Area' +
      '    </md-button>' +
      '  </div>' +
      '</md-dialog>';


    $scope.deleteMessage =
      '<md-dialog aria-label="Add dialog" style="width: 450px;">' +
      '  <md-dialog-content>'+
      '    <h3 class="md-display-1">Delete Category</h3>' +
      '      <md-input-container class="md-default-theme md-input-has-value">'  +
      '        Delete this category?'  +
      '       </md-input-container>'  +
      '  </md-dialog-content>' +
      '  <div class="md-actions">' +
      '    <md-button ng-click="closeDialog()" class="md-primary">' +
      '      Cancel' +
      '    </md-button>' +
      '    <md-button ng-click="deleteArea(Data.currentAreaIndex)" class="md-primary">' +
      '      Delete Category' +
      '    </md-button>' +
      '  </div>' +
      '</md-dialog>';


    // Area dialogs
    $scope.showDialog = showDialog;

    // Internal showDialog method.
    // Based on Angular Material dialog example.
    function showDialog($event, message) {
      var parentEl = angular.element(document.body);
      // Show a dialog with the specified options.
      $mdDialog.show({
        parent: parentEl,
        targetEvent: $event,
        template: message,
        controller: DialogController
      });

      // The mdDialog service runs in an isolated scope.
      // It should be possible to use the mdDialog service and it's
      // inner controller with other controllers in the project.
      // However, each context will require unique methods and events.
      // At least initially, let's create separate local controllers
      // and dialog services for each of the otter controllers.
      // Once complete, perhaps merge into a single member function.
      function DialogController($rootScope, $scope, $mdDialog, AreaDelete, AreaAdd, AreaList, Data) {

        $scope.Data = Data;

        $scope.deleteArea = function(id) {

          var result = AreaDelete.save({id: id});

          result.$promise.then(function(data) {
            if (data.status === 'success') {

              toast("Area Deleted");
              // after retrieving new area list, we need
              // to update the areas currently in view.
              $scope.getAreaList(null);

            }

          });

        };

        $scope.addArea = function(title) {

          var result = AreaAdd.save({title: title});

          result.$promise.then(function(data) {

            if (data.status === 'success') {
              toast("Area Added");
              // After area update succeeds, update the view.
              $scope.getAreaList(data.id);
              $scope.closeDialog();

            }

          });
        };

        $scope.getAreaList = function(id) {

          // Update the shared Data service
          Data.areas  = AreaList.query();

          // Broadcast event from rootScope so that
          // AreaCtrl will update list with the
          // new category.
          Data.areas.$promise.then(function () {
            if (id === null) {
              id = Data.areas[0].id;
            }
            $rootScope.$broadcast('areasUpdate', {id: id });
            $scope.closeDialog();
          });

        };


        $scope.closeDialog = function() {
          $mdDialog.hide();
        }

      }
      // Angular Material toast required by the DialogController.
      // As written, this function needs read/write access
      // to the scope object, and it's not obvious how one might
      // call this method from multiple controllers.  So this
      // basic pattern reappears in multiple controllers!
      function toast(content) {

        $scope.toastPosition = {
          bottom: false,
          top: true,
          left: false,
          right: true
        };

        $scope.getToastPosition = function () {
          return Object.keys($scope.toastPosition)
            .filter(function (pos) {
              return $scope.toastPosition[pos];
            })
            .join(' ');
        };

        $mdToast.show(
          $mdToast.simple()
            .content(content)
            .position($scope.getToastPosition())
            .hideDelay(3000)
        );

      }

    }

    $scope.init();

  }]);



// Category controller
taggerControllers.controller('CategoryCtrl', [
  '$rootScope',
  '$scope',
  '$mdDialog',
  'Category',
  'CategoryList',
  'CategoryUpdate',
  'CategoryAdd',
  'CategoryDelete',
  '$mdToast',
  '$animate',
  'Data',

  function(
    $rootScope,
    $scope,
    $mdDialog,
    Category,
    CategoryList,
    CategoryUpdate,
    CategoryAdd,
    CategoryDelete,
    $mdToast,
    $animate,
    Data ) {


    $scope.Data = Data.categories;
    $scope.areas = Data.areas;

    // Categories initialization, called on load.
    $scope.init = function() {

      $scope.categories = CategoryList.query();
      // Wait for response. Then in the shared Data service,
      // update the category array and set the current
      // index to the first item in the category list.
      $scope.categories
        .$promise
        .then(function(data) {
          $scope.Data.categories = data;
          if (data.length > 0) {
            Data.currentCategoryIndex = data[0].id;
            $scope.resetCategory(data[0].id);
          }
        });

    };

    // watch for changes in Data service
    $scope.$watch(function(scope) { return scope.Data.categories },
      function(newValue, oldValue) {
        $scope.categories = newValue;
      }
    );

    // Listen for categories update event.
    $scope.$on('categoriesUpdate', function(event, data) {
      console.log(data);
      $scope.categories = Data.categories;
      Data.currentCategoryIndex =data.id;
      $scope.resetCategory(data.id);
    });

    // reset the current category
    $scope.resetCategory = function(id) {

      $scope.category = Category.query({id: id});

    };


    // Update the category fields.
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
          // Toast upon success
          toast("Category Updated");
        }
      })

    };

    // Dialog Messages
    // Add category
    $scope.addMessage =
      '<md-dialog aria-label="Category dialog" style="width: 450px;">' +
      '  <md-dialog-content>'+
      '    <h3 class="md-display-1">New Category</h3>' +
      '      <md-input-container class="md-default-theme md-input-has-value">'  +
      '         <label for="input_4">Name</label><input type="text" ng-model="category.title" class="ng-pristine ng-valid md-input ng-touched" id="input_4" tabindex="0" aria-invalid="false" style="">'  +
      '       </md-input-container>'  +
      '  </md-dialog-content>' +
      '  <div class="md-actions">' +
      '    <md-button ng-click="closeDialog()" class="md-primary">' +
      '      Cancel' +
      '    </md-button>' +
      '    <md-button ng-click="addCategory(category.title)" class="md-primary">' +
      '      Add Category' +
      '    </md-button>' +
      '  </div>' +
      '</md-dialog>';

    // delete category
    $scope.deleteMessage =
      '<md-dialog aria-label="Delete dialog" style="width: 450px;">' +
      '  <md-dialog-content>'+
      '    <h3 class="md-display-1">Delete Category</h3>' +
      '      <md-input-container class="md-default-theme md-input-has-value">'  +
      '        Delete this category?'  +
      '       </md-input-container>'  +
      '  </md-dialog-content>' +
      '  <div class="md-actions">' +
      '    <md-button ng-click="closeDialog()" class="md-primary">' +
      '      Cancel' +
      '    </md-button>' +
      '    <md-button ng-click="deleteCategory(Data.currentCategoryIndex)" class="md-primary">' +
      '      Delete Category' +
      '    </md-button>' +
      '  </div>' +
      '</md-dialog>';


    $scope.showDialog = showDialog;

    // The internal showDialog method.
    // Based on Angular Material dialog example.
    function showDialog($event, message) {
      var parentEl = angular.element(document.body);
      // Show a dialog with the specified options.
      $mdDialog.show({
        parent: parentEl,
        targetEvent: $event,
        template: message,
        controller: DialogController
      });

      // The mdDialog service runs in an isolated scope.
      // It should be possible to use the mdDialog service and it's
      // inner controller with other controllers in the project.
      // However, each context will require unique methods and events.
      // At least initially, let's create separate local controllers
      // and dialog services for each of the otter controllers.
      // Once complete, perhaps merge into a single member function.
      function DialogController($rootScope, $scope, $mdDialog, CategoryAdd, CategoryList, Data) {

        $scope.Data = Data;

        $scope.deleteCategory = function(id) {

          var result = CategoryDelete.save({id: id});

          result.$promise.then(function(data) {
            if (data.status === 'success') {

              toast("Category Deleted");
              // After retrieving new category list, we need
              // to update the category currently in view.
              // This method is designed to take an id
              // parameter.  But if this is null, it
              // uses the id of the first category in the
              // updated list. That's what we want in the
              // case of deletions.
              $scope.getCategoryList(null);
              $scope.closeDialog();

            }

          });

        };

        // Called when user selects add category
        // in the dialog.
        $scope.addCategory = function(title) {

          var result = CategoryAdd.save({title: title});

          result.$promise.then(function(data) {

            if (data.status === 'success') {

              toast("Category Added");
              // Update the category list. The
              // id parameter will be used to select
              // the newly added category for editing.
              $scope.getCategoryList(data.id);
              // Does what you'd expect.
              $scope.closeDialog();

            }

          });
        };

        // Retrieves a new category list.  On return, broadcasts event
        // to the rootScope, passing references to the new category
        // list and the id param passed into the method. If the id param
        // is null, broadcasts the id of the first item listed in the
        // new category array. This cause a view to update with the new
        // category list and an item in the edit panel.
        $scope.getCategoryList = function(id) {

          // Update the shared Data service
          Data.categories  = CategoryList.query();
          // Wait for callback.
          Data.categories.$promise.then(function () {
            // Deleting a category doesn't generate
            // a new id. In that case, expect the
            // id to be null. Update the view using the
            // id of the first item in the updated category
            // list.
            if (id === null) {

              id = Data.categories[0].id;

            }

            $rootScope.$broadcast('categoriesUpdate', {id: id });


          });

        };

        $scope.closeDialog = function() {
          // This does what you'd expect.
          $mdDialog.hide();
        }

      }
    }

    // Using the Angular Material toast service.
    // As written, this function requires read/write access
    // to the scope object.  It's not obvious how one might
    // call this method from multiple controllers.  So where
    // needed, this reappears in other controllers.
    function toast(content) {

      $scope.toastPosition = {
        bottom: false,
        top: true,
        left: false,
        right: true
      };

      $scope.getToastPosition = function () {
        return Object.keys($scope.toastPosition)
          .filter(function (pos) {
            return $scope.toastPosition[pos];
          })
          .join(' ');
      };

      $mdToast.show(
        $mdToast.simple()
          .content(content)
          .position($scope.getToastPosition())
          .hideDelay(3000)
      );

    }

    // call init on bind
    $scope.init();


  }

]);



