'use strict';

var host = 'http://localhost:3000/rest/';
//var host = 'http://libmedia.willamette.edu/acomrest2/';


var taggerServices = angular.module('taggerServices', ['ngResource']);


// Needed?
taggerServices.provider('UseHost', [
  function () {
    this.host = 'localhost';
    this.$get = function () {
      var host = this.host;
      return {
        host: function getHost() {
          return host;
        }
      }
    };
    this.setHost = function (host) {
      this.host = host;
    }
  }
]);


/**
 * D3 service lazyloads the d3 script and
 * calls onScriptLoad function when ready.
 * Note that the path to the javascript
 * library is hardcoded.  It should be injected
 * into this service or perhaps configured via
 * the provider in app.js.
 */
taggerServices.factory('d3Service', [
  '$document',
  '$q',
  '$rootScope',
  function ($document,
            $q,
            $rootScope) {

    var d = $q.defer();

    function onScriptLoad() {
      // Load client in the browser
      $rootScope.$apply(function () {
        d.resolve(window.d3);
      });
    }

    // Create a script tag with d3 as the source
    // and call our onScriptLoad callback when it
    // has been loaded
    var scriptTag = $document[0].createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.async = true;
    scriptTag.src = 'bower_components/d3/d3.min.js';
    scriptTag.onreadystatechange = function () {
      if (this.readyState === 'complete') {
        onScriptLoad();
      }
    };
    scriptTag.onload = onScriptLoad;
    var s = $document[0].getElementsByTagName('body')[0];
    s.appendChild(scriptTag);
    return {
      d3: function () {
        return d.promise;
      }
    };

  }]);


/**
 * ngResource services
 */

/**
 * Maps to controller: users.list
 */
taggerServices.factory('UserList', ['$resource',
  function ($resource) {
    return $resource(host + 'users/list');
  }
]);
/**
 * Maps to controller: users.add
 */
taggerServices.factory('UserAdd', ['$resource',
  function ($resource) {
    return $resource(host + 'users/add');
  }
]);
/**
 * Maps to controller: users.delete
 */
taggerServices.factory('UserDelete', ['$resource',
  function ($resource) {
    return $resource(host + 'users/delete');
  }
]);
/**
 * Maps to controller: users.update
 */
taggerServices.factory('UserUpdate', ['$resource',
  function ($resource) {
    return $resource(host + 'users/update');
  }
]);
/**
 * Maps to controller: collection.repoTypeByArea
 */
taggerServices.factory('SearchOptionType', ['$resource',
  function ($resource) {
    return $resource(host + 'collection/repoTypeByArea/:areaId', {}, {
      query: {method: 'GET', isArray: true}
    });
  }
]);
/**
 * Maps to controller: collection.countCTypesByArea
 */
taggerServices.factory('CollectionTypeCount', ['$resource',
  function ($resource) {
    return $resource(host + 'collection/count/types/byArea/:areaId', {}, {
      query: {method: 'GET', isArray: true}
    });
  }
]);
/**
 * Maps to controller: collection.browseTypesByArea
 */
taggerServices.factory('CollectionLinkCount', ['$resource',
  function ($resource) {
    return $resource(host + 'collection/count/linkTypes/byArea/:areaId', {}, {
      query: {method: 'GET', isArray: true}
    });
  }
]);
/**
 * Maps to controller: collection.list
 */
taggerServices.factory('CollectionsByArea', ['$resource',
  function ($resource) {
    return $resource(host + 'collection/show/list/:areaId', {}, {
      query: {method: 'GET', isArray: true}
    });
  }
]);
/**
 * Maps to controller: collection.byId
 */
taggerServices.factory('CollectionById', ['$resource',
  function ($resource) {
    return $resource(host + 'collection/byId/:id', {}, {
      query: {method: 'GET', isArray: false}
    });
  }
]);
/**
 * Maps to controller: collection.add
 */
taggerServices.factory('CollectionAdd', ['$resource',
  function ($resource) {
    return $resource(host + 'collection/add');
  }
]);
/**
 * Maps to controller: collection.delete
 */
taggerServices.factory('CollectionDelete', ['$resource',
  function ($resource) {
    return $resource(host + 'collection/delete');
  }
]);
/**
 * Maps to controller: collection.update
 */
taggerServices.factory('CollectionUpdate', ['$resource',
  function ($resource) {
    return $resource(host + 'collection/update');
  }
]);
/**
 * Maps to controller: collection.areas
 */
taggerServices.factory('AreasForCollection', ['$resource',
  function ($resource) {
    return $resource(host + 'collection/areas/:collId', {}, {
      query: {method: 'GET', isArray: true}
    });
  }
]);
/**
 * Maps to controller: collection.tagsForCollection
 */
taggerServices.factory('TagsForCollection', ['$resource',
  function ($resource) {
    return $resource(host + 'collection/tags/:collId', {}, {
      query: {method: 'GET', isArray: true}
    });
  }
]);
/**
 * Maps to controller: collection.typesForCollection
 */
taggerServices.factory('TypesForCollection', ['$resource',
  function ($resource) {
    return $resource(host + 'collection/types/:collId', {}, {
      query: {method: 'GET', isArray: true}
    });
  }
]);
/**
 * Maps to controller: collection.addAreaTarget
 */
taggerServices.factory('AreaTargetAdd', ['$resource',

  function Resource($resource) {
    return $resource(host + 'collection/:collId/add/area/:areaId', {}, {
      query: {method: 'GET', isArray: false}
    });
  }
]);
/**
 * Maps to controller: collection.removeAreaTarget
 */
taggerServices.factory('AreaTargetRemove', ['$resource',
  function Resource($resource) {
    return $resource(host + 'collection/:collId/remove/area/:areaId', {}, {
      query: {method: 'GET', isArray: false}
    });
  }]);
/**
 * Maps to controller: collection.addTagTarget
 */
taggerServices.factory('CollectionTagTargetAdd', ['$resource',
  function Resource($resource) {
    return $resource(host + 'collection/:collId/add/tag/:tagId', {}, {
      query: {method: 'GET', isArray: false}
    });
  }
]);
/**
 * Maps to controller: collection.removeTagTarget
 */
taggerServices.factory('CollectionTagTargetRemove', ['$resource',
  function Resource($resource) {
    return $resource(host + 'collection/:collId/remove/tag/:tagId', {}, {
      query: {method: 'GET', isArray: false}
    });
  }]);
/**
 * Maps to controller: collection.removeTypeTaget
 */
taggerServices.factory('CollectionTypeTargetRemove', ['$resource',
  function Resource($resource) {
    return $resource(host + 'collection/:collId/remove/type/:typeId', {}, {
      query: {method: 'GET', isArray: false}
    });
  }]);
/**
 * Maps to controller: collection.addTypeTarget
 */
taggerServices.factory('CollectionTypeTargetAdd', ['$resource',
  function Resource($resource) {
    return $resource(host + 'collection/:collId/add/type/:typeId', {}, {
      query: {method: 'GET', isArray: false}
    });
  }]);

// AREAS

/**
 * Maps to controller: areas.list
 */
taggerServices.factory('AreaList', ['$resource',
  function ($resource) {
    return $resource(host + 'areas', {}, {
      query: {method: 'GET', isArray: true}
    });
  }
]);
/**
 * Maps to controller: areas.byId
 */
taggerServices.factory('AreaById', ['$resource',
  function ($resource) {
    return $resource(host + 'area/byId/:id', {}, {
      query: {method: 'GET', isArray: false}
    });
  }
]);
/**
 * Maps to controller: areas.add
 */
taggerServices.factory('AreaAdd', ['$resource',
  function ($resource) {
    return $resource(host + 'area/add');
  }
]);
/**
 * Maps to controller: areas.delete
 */
taggerServices.factory('AreaDelete', ['$resource',
  function ($resource) {
    return $resource(host + 'area/delete');
  }
]);
/**
 * Maps to controller: areas.reorder
 */
taggerServices.factory('ReorderAreas', ['$resource',
  function($resource) {
    return $resource(host + 'area/reorder');
  }
]);
/**
 * Maps to controller: areas.update
 */
taggerServices.factory('AreaUpdate', ['$resource',
  function ($resource) {
    return $resource(host + 'area/update');
  }
]);

// CATEGORY

/**
 * Maps to controller: category.byId
 */
taggerServices.factory('Category', ['$resource',
  function ($resource) {
    return $resource(host + 'category/byId/:id', {}, {
      query: {method: 'GET', isArray: false}
    });
  }
]);
/**
 * Maps to controller: category.list
 */
taggerServices.factory('CategoryList', ['$resource',
  function ($resource) {
    return $resource(host + 'category/show/list', {}, {
      query: {method: 'GET', isArray: true}
    });
  }
]);
/**
 * Maps to controller: category.listByArea
 */
taggerServices.factory('CategoryByArea', ['$resource',
  function ($resource) {
    return $resource(host + 'category/byArea/:areaId', {}, {
      query: {method: 'GET', isArray: true}
    })
  }]);
/**
 * Maps to controller: category.categoryCountByArea
 */
taggerServices.factory('CategoryCountByArea', ['$resource',
  function ($resource) {
    return $resource(host + 'category/count/:areaId', {}, {
      query: {method: 'GET', isArray: true}
    })
  }]);
/**
 * Maps to controller: category.update
 */
taggerServices.factory('CategoryUpdate', ['$resource',
  function ($resource) {
    return $resource(host + 'category/update');
  }
]);
/**
 * Maps to controller: category.add
 */
taggerServices.factory('CategoryAdd', ['$resource',
  function ($resource) {
    return $resource(host + 'category/add');
  }
]);
/**
 * Maps to controller: category.delete
 */
taggerServices.factory('CategoryDelete', ['$resource',
  function ($resource) {
    return $resource(host + 'category/delete');
  }
]);

// CONTENT TYPE

/**
 * Maps to controller: content.countByArea
 */
taggerServices.factory('ContentTypeCount', ['$resource',
  function ($resource) {
    return $resource(host + 'content/byArea/count/:areaId', {}, {
      query: {method: 'GET', isArray: true}
    });
  }
]);
/**
 * Maps to controller: content.byId
 */
taggerServices.factory('ContentType', ['$resource',
  function ($resource) {
    return $resource(host + 'content/byId/:id', {}, {
      query: {method: 'GET', isArray: false}
    });
  }
]);
/**
 * Maps to controller: content.list
 */
taggerServices.factory('ContentTypeList', ['$resource',
  function ($resource) {
    return $resource(host + 'content/show/list', {}, {
      query: {method: 'GET', isArray: true}
    });
  }
]);
/**
 * Maps to controller: content.add
 */
taggerServices.factory('ContentTypeAdd', ['$resource',
  function ($resource) {
    return $resource(host + 'content/add');
  }
]);
/**
 * Maps to controller: content.delete
 */
taggerServices.factory('ContentTypeDelete', ['$resource',
  function ($resource) {
    return $resource(host + 'content/delete');
  }
]);

taggerServices.factory('ContentTypeUpdate', ['$resource',
  function ($resource) {
    return $resource(host + 'content/update');
  }
]);

// TAG
/**
 * Maps to controller: tags.tagByAreaCount
 */
taggerServices.factory('TagCountForArea', ['$resource',
  function Resource($resource) {
    return $resource(host + 'tags/count/byArea/:areaId', {}, {
      query: {method: 'GET', isArray: true}
    });
  }]);
/**
 * Maps to controller: tags.tagByArea
 */
taggerServices.factory('TagsForArea', ['$resource',
  function Resource($resource) {
    return $resource(host + 'tags/byArea/:areaId', {}, {
      query: {method: 'GET', isArray: true}
    });
  }]);
/**
 * Maps to controller: tags.byId
 */
taggerServices.factory('TagById', ['$resource',
  function ($resource) {
    return $resource(host + 'tag/byId/:id', {}, {
      query: {method: 'GET', isArray: false}
    });
  }
]);
/**
 * Maps to controller: tags.list
 */
taggerServices.factory('TagList', ['$resource',
  function ($resource) {
    return $resource(host + 'tag/show/list', {}, {
      query: {method: 'GET', isArray: true}
    });
  }
]);
/**
 * Maps to controller: tags.add
 */
taggerServices.factory('TagAdd', ['$resource',
  function ($resource) {
    return $resource(host + 'tag/add');
  }
]);
/**
 * Maps to controller: tags.delete
 */
taggerServices.factory('TagDelete', ['$resource',
  function ($resource) {
    return $resource(host + 'tag/delete');
  }
]);
/**
 * Maps to controller: tags.update
 */
taggerServices.factory('TagUpdate', ['$resource',
  function ($resource) {
    return $resource(host + 'tag/update');
  }
]);

// Tag area services

/**
 * Maps to controller: tags.addTarget
 */
taggerServices.factory('TagTargetAdd', ['$resource',

  function Resource($resource) {
    return $resource(host + 'tag/:tagId/add/area/:areaId', {}, {
      query: {method: 'GET', isArray: false}
    });
  }
]);
/**
 * Maps to controller: tags.removeTarget
 */
taggerServices.factory('TagTargetRemove', ['$resource',
  function Resource($resource) {
    return $resource(host + 'tag/:tagId/remove/area/:areaId', {}, {
      query: {method: 'GET', isArray: false}
    });
  }]);
/**
 * Maps to controller: tags.getAreaTarget
 */
taggerServices.factory('TagTargets', ['$resource',
  function Resource($resource) {
    return $resource(host + 'tag/targets/byId/:tagId', {}, {
      query: {method: 'GET', isArray: true}
    });
  }]);



/**
 * Using the Angular Material mdToast
 * directive throughout the application.
 * This toast service takes a single
 * message parameter.
 */
taggerServices.factory('TaggerToast', [

  '$mdToast',
  function ($mdToast) {

    function toast(content) {

      var toastPosition = {
        bottom: false,
        top: true,
        left: true,
        right: false
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


/**
 * Using the Angular Material mdDialog directive
 * for add and delete operations. mdDialog has
 * it's own scope.  Defining the controller here
 * to include add/delete methods for the app.
 */
taggerServices.factory('TaggerDialog', [

  'Upload',
  '$rootScope',
  '$mdDialog',

  function (UpLoad,
            $rootScope,
            $mdDialog) {

    // Internal showDialog method.
    var showDialog = function ($event, message) {

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
    function DialogController(//  $rootScope,
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
      CollectionAdd,
      CollectionDelete,
      CollectionsByArea,
      TaggerToast,
      Upload,
      Data) {

      $scope.closeDialog = function () {
        $mdDialog.hide();
      };

      $scope.deleteTag = function () {

        var result = TagDelete.save({id: Data.currentTagIndex});
        result.$promise.then(function (data) {
          if (data.status === 'success') {

            TaggerToast("Tag Deleted");
            // after retrieving new area list, we need
            // to update the areas currently in view.
            $scope.getTagList(null);
            $scope.closeDialog();
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
        var tags = TagList.query();

        // Broadcast event from rootScope so that
        // AreaCtrl will update list with the
        // new category.
        tags.$promise.then(function () {
          if (id === null) {
            Data.currentTagIndex = Data.tags[0].id;
          } else {
            Data.currentTagIndex = id;
          }
          Data.tags = tags;
          //     $rootScope.$broadcast('tagsUpdate', {});
          $scope.closeDialog();
        });

      };


      $scope.deleteArea = function (id) {

        var result = AreaDelete.save({id: Data.currentAreaIndex});
        result.$promise.then(function (data) {
          if (data.status === 'success') {

            TaggerToast("Area Deleted");
            // after retrieving new area list, we need
            // to update the areas currently in view.
            $scope.getAreaList(null);

          }

        });

      };

      $scope.addArea = function (title) {

        var result = AreaAdd.save({title: title});

        result.$promise.then(function (data) {

          if (data.status === 'success') {
            TaggerToast("Area Added");
            // After area update succeeds, update the view.
            $scope.getAreaList(data.id);
            $scope.closeDialog();

          }

        });
      };

      $scope.getAreaList = function (id) {
        // Update the shared Data service
        Data.areas = AreaList.query();

        // Broadcast event from rootScope so that
        // AreaCtrl will update list with the
        // new category.
        Data.areas.$promise.then(function () {
          console.log('service: areas');
          console.log(data);
          if (id === null) {
            Data.currentAreaIndex = Data.areas[0].id;
          } else {
            Data.currentAreaIndex = id;
          }
          //  $rootScope.$broadcast('areasUpdate', {});
          $scope.closeDialog();
        });

      };

      $scope.deleteCategory = function () {

        var result = CategoryDelete.save({id: Data.currentCategoryIndex});
        result.$promise.then(function (data) {
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
      $scope.addCategory = function (title) {

        var result = CategoryAdd.save({title: title});

        result.$promise.then(function (data) {

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

      $scope.getCategoryList = function (id) {

        // Update the shared Data service
        Data.categories = CategoryList.query();
        Data.categories.$promise.then(function () {
          if (id === null) {

            Data.currentCategoryIndex = Data.categories[0].id;

          } else {

            Data.currentCategoryIndex = id;

          }
          // $rootScope.$broadcast('categoriesUpdate', { });


        });

      };


      $scope.deleteContentType = function (id) {

        var result = ContentTypeDelete.save({id: Data.currentContentIndex});

        result.$promise.then(function (data) {
          if (data.status === 'success') {

            TaggerToast("Content Type Deleted");
            // After retrieving new content type list, we need
            // to update the content types currently in view.
            // This method is designed to take an id
            // parameter.  If this param is null, it
            // uses the id of the first category in the
            // updated list. That's what we want in the
            // case of deletions.
            $scope.getContentList(null);
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
      $scope.getContentList = function (id) {

        // Update the shared Data service
        Data.contentTypes = ContentTypeList.query();
        // Wait for callback.
        Data.contentTypes.$promise.then(function () {
          // Deleting a category doesn't generate
          // a new id. In that case, expect the
          // id to be null. Update the view using the
          // id of the first item in the updated category
          // list.
          if (id === null) {
            Data.currentContentIndex = Data.contentTypes[0].id;

          } else {
            Data.currentContentIndex = id;
          }

          //   $rootScope.$broadcast('contentUpdate', {});


        });

      };

      // Called when user selects add category
      // in the dialog.
      $scope.addContentType = function (title) {

        var result = ContentTypeAdd.save({title: title});

        result.$promise.then(function (data) {

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

      $scope.addCollection = function (title) {

        var result = CollectionAdd.save({title: title, areaId: Data.currentAreaIndex});

        result.$promise.then(function (data) {

          if (data.status === 'success') {

            TaggerToast("Collection Added");
            // Update the category list. The
            // id parameter will be used to select
            // the newly added category for editing.
            $scope.getCollectionList(data.id);
            // Does what you'd expect.
            $scope.closeDialog();

          }
        });
      };

      $scope.deleteCollection = function () {
        var result = CollectionDelete.save({id: Data.currentCollectionIndex});

        result.$promise.then(function (data) {
          if (data.status === 'success') {

            TaggerToast("Collection Deleted");
            // After retrieving new category list, we need
            // to update the category currently in view.
            // This method is designed to take an id
            // parameter.  But if this is null, it
            // uses the id of the first category in the
            // updated list. That's what we want in the
            // case of deletions.
            $scope.getCollectionList(null);
            $scope.closeDialog();

          }

        });

      };

      $scope.getCollectionList = function (id) {

        // Update the shared Data service
        var result = CollectionsByArea.query({areaId: Data.currentAreaIndex});
        // Wait for callback.
        result.$promise.then(function (data) {

          Data.collections = data;
          // Deleting a category doesn't generate
          // a new id. In that case, expect the
          // id to be null. Update the view using the
          // id of the first item in the updated category
          // list.
          if (id === null) {
            Data.currentCollectionIndex = Data.collections[0].collection.id;

          } else {
            Data.currentCollectionIndex = id;
          }

        });

      };


      $scope.uploadImage = function (file) {

        if (file !== undefined) {
          Upload.upload({
            url: '/admin/collection/image',
            file: file,
            fields: {id: Data.currentCollectionIndex}
          }).progress(function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
          }).success(function (data, status, headers, config) {
            Data.currentThumbnailImage = config.file.name;
            $scope.closeDialog();
            console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
          }).error(function (data, status, headers, config) {
            console.log('error status: ' + status);
          })
        }
        ;


      }

    }


  }]);


