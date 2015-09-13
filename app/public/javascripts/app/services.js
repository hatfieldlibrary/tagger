
'use strict';

var host = 'http://localhost:3000/rest/';
var adminhost = 'http://localhost:3000/admin/';
//var host = 'http://libmedia.willamette.edu/acomrest2/';
//var adminhost = 'http://localhost:3000/taggerAdmin/';
var taggerServices = angular.module('taggerServices', ['ngResource']);


// COLLECTION

taggerServices.factory('CollectionsByArea', ['$resource',
  function($resource){
    return $resource(host + 'collection/byArea/:id', {}, {
      query: {method:'GET', isArray:true}
    });
  }
]);

taggerServices.factory('CollectionById', ['$resource',
  function($resource) {
    return $resource(host + 'collection/byId/:id', {}, {
      query: {method:'GET', isArray: false}
    });
  }
]);

taggerServices.factory('TagsForCollection', ['$resource',
  function($resource) {
    return $resource(host + 'collection/tags/:id', {}, {
      query: {method:'GET', isArray: true}
    });
  }
]);

taggerServices.factory('TypesForCollection', ['$resource',
  function($resource) {
    return $resource(host + 'collection/types/:id', {}, {
      query: {method:'GET', isArray: true}
    });
  }
]);

// AREA

taggerServices.factory('AreaList', ['$resource',
  function($resource) {
    return $resource(host + 'areas', {}, {
      query: {method:'GET', isArray: true}
    });
  }
]);

taggerServices.factory('AreaById', ['$resource',
  function( $resource) {
    return $resource(host + 'area/byId/:id', {}, {
      query: {method:'GET', isArray: false}
    });
  }
]);

taggerServices.factory('AreaAdd', ['$resource',
  function($resource) {
    return $resource(host + 'area/add');
  }
]);

taggerServices.factory('AreaDelete', ['$resource',
  function($resource) {
    return $resource(host + 'area/delete');
  }
]);



taggerServices.factory('AreaUpdate', ['$resource',
  function($resource) {
    return $resource(host + 'area/update');
  }
]);

// CATEGORY

taggerServices.factory('Category', ['$resource',
  function($resource) {
    return $resource(host + 'category/byId/:id', {}, {
      query: {method:'GET', isArray: false}
    });
  }
]);

taggerServices.factory('CategoryList', ['$resource',
  function($resource) {
    return $resource(host + 'category/show/list', {}, {
      query: {method:'GET', isArray: true}
    });
  }
]);

taggerServices.factory('CategoryUpdate', ['$resource',
  function($resource) {
    return $resource(host + 'category/update');
  }
]);

taggerServices.factory('CategoryAdd', ['$resource',
  function($resource) {
    return $resource(host + 'category/add');
  }
]);

taggerServices.factory('CategoryDelete', ['$resource',
  function($resource) {
    return $resource(host + 'category/delete');
  }
]);

// CONTENT TYPE

taggerServices.factory('ContentType', ['$resource',
  function($resource) {
    return $resource(host + 'content/byId/:id', {}, {
      query: {method:'GET', isArray: false}
    });
  }
]);

taggerServices.factory('ContentTypeList', ['$resource',
  function($resource) {
    return $resource(host + 'content/show/list', {}, {
      query: {method:'GET', isArray: true}
    });
  }
]);

taggerServices.factory('ContentTypeAdd', ['$resource',
  function($resource) {
    return $resource(host + 'content/add');
  }
]);

taggerServices.factory('ContentTypeDelete', ['$resource',
  function($resource) {
    return $resource(host + 'content/delete');
  }
]);

taggerServices.factory('ContentTypeUpdate', ['$resource',
  function($resource) {
    return $resource(host + 'content/update');
  }
]);

// TAG

taggerServices.factory('TagById', ['$resource',
  function($resource) {
    return $resource(host + 'tag/byId/:id', {}, {
      query: {method:'GET', isArray: false}
    });
  }
]);

taggerServices.factory('TagList', ['$resource',
  function($resource) {
    return $resource(host + 'tag/show/list', {}, {
      query: {method:'GET', isArray: true}
    });
  }
]);

taggerServices.factory('TagAdd', ['$resource',
  function($resource) {
    return $resource(host + 'tag/add');
  }
]);

taggerServices.factory('TagDelete', ['$resource',
  function($resource) {
    return $resource(host + 'tag/delete');
  }
]);

taggerServices.factory('TagUpdate', ['$resource',
  function($resource) {
    return $resource(host + 'tag/update');
  }
]);

taggerServices.factory('TagTargetAdd', ['$resource',

  function Resource($resource) {
    return $resource(host + 'tag/update');
  }

]);


// SHARED DATA SERVICE
taggerServices.factory('Data', function() {
  return {
    areas: [],
    currentAreaIndex: 0,
    currentCategoryIndex: 0,
    categories: [],
    currentContentIndex: 0,
    contentTypes: [],
    tags: [],
    currentTagIndex: 0
  };
});

// TOAST SERVICE
taggerServices.factory('TaggerToast', [

  '$mdToast',
  function( $mdToast) {

    function toast(content) {

      var toastPosition = {
        bottom: false,
        top: true,
        left: false,
        right: true
      };

      var getToastPosition = function () {
        return Object.keys(toastPosition)
          .filter(function (pos) {
            return toastPosition[pos];
          })
          .join(' ');
      };

      $mdToast.show(
        $mdToast.simple()
          .content(content)
          .position(getToastPosition())
          .hideDelay(3000)
      );

    }
    return toast;

  }]);


// DIALOG SERVICE
taggerServices.factory('TaggerDialog', [

  '$rootScope',
  '$mdDialog',

  function(

    $rootScope,
    $mdDialog

  ) {

    // Internal showDialog method.
    var showDialog = function($event, message ) {

      var parentEl = angular.element(document.body);

      // Show a dialog with the specified options.
      $mdDialog.show({
        parent: parentEl,
        targetEvent: $event,
        templateUrl: message,
        controller: DialogController
      });

    };

    return showDialog;


    // The mdDialog service runs in an isolated scope.
    function DialogController(

      $rootScope,
      $scope,
      $mdDialog,
      TagAdd,
      TagList,
      TagDelete,
      AreaAdd,
      AreaList,
      AreaDelete,
      Category,
      CategoryList,
      CategoryAdd,
      CategoryDelete,
      ContentTypeList,
      ContentTypeAdd,
      ContentTypeDelete,
      TaggerToast,
      Data) {

      $scope.deleteTag = function () {

        var result = TagDelete.save({id: Data.currentTagIndex});
        result.$promise.then(function (data) {
          if (data.status === 'success') {

            TaggerToast("Area Deleted");
            // after retrieving new area list, we need
            // to update the areas currently in view.
            $scope.getTagList(null);

          }

        });

      };

      $scope.addTag = function (name) {

        var result = TagAdd.save({name: name});

        result.$promise.then(function (data) {

          if (data.status === 'success') {
            TaggerToast("Tag Added");
            // After area update succeeds, update the view.
            $scope.getTagList(data.id);
            $scope.closeDialog();

          }

        });
      };

      $scope.getTagList = function (id) {

        // Update the shared Data service
        Data.tags = TagList.query();

        // Broadcast event from rootScope so that
        // AreaCtrl will update list with the
        // new category.
        Data.tags.$promise.then(function () {
          if (id === null) {
            Data.currentTagIndex = Data.tags[0].id;
          } else {
            Data.currentTagIndex = id;
          }
          $rootScope.$broadcast('tagsUpdate', {});
          $scope.closeDialog();
        });

      };


      $scope.deleteArea = function(id) {

        var result = AreaDelete.save({id: Data.currentAreaIndex});
        result.$promise.then(function(data) {
          if (data.status === 'success') {

            TaggerToast("Area Deleted");
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
            TaggerToast("Area Added");
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
            Data.currentAreaIndex = Data.areas[0].id;
          } else {
            Data.currentAreaIndex = id;
          }
          $rootScope.$broadcast('areasUpdate', {});
          $scope.closeDialog();
        });

      };

      $scope.deleteCategory = function() {

        var result = CategoryDelete.save({id: Data.currentContentIndex});
        result.$promise.then(function(data) {
          if (data.status === 'success') {

            TaggerToast("Category Deleted");
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
            TaggerToast("Category Added");
            // Update the category list. The
            // id parameter will be used to select
            // the newly added category for editing.
            $scope.getCategoryList(data.id);
            // Does what you'd expect.
            $scope.closeDialog();

          }

        });
      };

      $scope.getCategoryList = function(id) {

        // Update the shared Data service
        Data.categories  = CategoryList.query();
        Data.categories.$promise.then(function () {
          if (id === null) {

            Data.currentCategoryIndex = Data.categories[0].id;

          } else {

            Data.currentCategoryIndex = id;

          }

          $rootScope.$broadcast('categoriesUpdate', { });


        });

      };


      $scope.deleteContentType = function(id) {

        var result = ContentTypeDelete.save({id: Data.currentContentIndex});

        result.$promise.then(function(data) {
          if (data.status === 'success') {

            TaggerToast("Content Type Deleted");
            // After retrieving new category list, we need
            // to update the category currently in view.
            // This method is designed to take an id
            // parameter.  But if this is null, it
            // uses the id of the first category in the
            // updated list. That's what we want in the
            // case of deletions.
            $scope.getContentList(null);
            $scope.closeDialog();

          }

        });

      };

      // Called when user selects add category
      // in the dialog.
      $scope.addContentType = function(title) {

        var result = ContentTypeAdd.save({title: title});

        result.$promise.then(function(data) {

          if (data.status === 'success') {

            TaggerToast("Content Type Added");
            // Update the category list. The
            // id parameter will be used to select
            // the newly added category for editing.
            $scope.getContentList(data.id);
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
      $scope.getContentList = function(id) {

        // Update the shared Data service
        Data.contentTypes  = ContentTypeList.query();
        // Wait for callback.
        Data.contentTypes.$promise.then(function () {
          // Deleting a category doesn't generate
          // a new id. In that case, expect the
          // id to be null. Update the view using the
          // id of the first item in the updated category
          // list.
          if (id === null) {
            Data.currentContentIndex = Data.contentTypes[0].id;

          }  else {
            Data.currentContentIndex = id;
          }

          $rootScope.$broadcast('contentUpdate', {});


        });

      };


      $scope.closeDialog = function () {
        $mdDialog.hide();
      };

    }


  }]);


