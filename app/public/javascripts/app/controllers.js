
'use strict';

var taggerControllers = angular.module('taggerControllers', []);



/*
 *
 *  TOP-LEVEL LAYOUT CONTROLLER
 *
 */

taggerControllers.controller('LayoutCtrl', ['$scope', 'Data', 'AreaList', function($scope, Data, AreaList) {

  $scope.Data = Data;
  $scope.areas = AreaList.query();
  $scope.areas.$promise.then(function(data) {
    Data.currentAreaIndex = $scope.areas[0].id;
    Data.areas = data;
  });

}]);




/*
 *
 *  COLLECTIONS CONTROLLER
 *
 */

taggerControllers.controller('CollectionCtrl', [

  '$scope',
  '$resource',
  'CollectionsByArea',
  'CollectionById',
  'CollectionUpdate',
  'TagsForCollection',
  'TypesForCollection',
  'TaggerDialog',
  'Data',

  function(
    $scope,
    $resource,
    CollectionsByArea,
    CollectionById,
    CollectionUpdate,
    TagsForCollection,
    TypesForCollection,
    TaggerDialog,
    Data ) {


    $scope.Data = Data;
    $scope.areas = Data.areas;
    $scope.collectionList = [];
    $scope.collection = {title: 'test'};


    $scope.$watch(function() { return Data.areas },
      function(newValue) {
        $scope.areas = newValue;
        console.log($scope.areas);
      }
    );

    $scope.$watch(function() { return Data.currentAreaIndex },
      function(newValue) {
        if (newValue !== null) {
          $scope.Data.currentAreaIndex = newValue;
          $scope.init();
        }
      }
    );

    $scope.$watch(function() { return Data.collections},
      function() {
        $scope.collectionList = Data.collections;
        console.log($scope.collectionList);
      });


    // Initialization method called on load.
    $scope.init = function() {

      $scope.collectionList = CollectionsByArea.query({areaId: $scope.Data.currentAreaIndex});
      $scope.collectionList.$promise.then(function(data) {
        if (typeof data !== 'undefined')     {
          if (data.length > 0) {
            $scope.getCollectionById(data[0].CollectionId);
          }
        }
        /*
         $scope.collectionTags = TagsForCollection
         .query({id: data[0].CollectionId});
         $scope.collectionTypes = TypesForCollection
         .query({id: data[0].CollectionId});    */

      });
    };

    $scope.getCollectionArea = function(id) {

    //  $scope.collectionList = CollectionsByArea.query({id: id});

    };

    /*
     $scope.getTagsForCollection = function(id) {

     $scope.collectionTags = TagsForCollection(id);

     };
     */
    $scope.getCollectionById = function(id) {

    //  $scope.collection = CollectionById.query({id: id});

    };


// Tag dialog messages
    $scope.addMessage = 'templates/addCollectionMessage.html';
    $scope.deleteMessage = 'templates/deleteCollectionMessage.html';

// Collection dialogs
    $scope.showDialog = showDialog;
    function showDialog($event, message) {
         alert('a');
      TaggerDialog($event, message);
    }


//$scope.init();

  }]);



/*
 *
 *  TAGS CONTROLLER
 *
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

    $scope.Data = Data;
    $scope.tags = Data.tags;

    $scope.init = function() {
      $scope.tags = TagList.query();
      $scope.tags
        .$promise
        .then(function (data) {
          console.log(data);
          $scope.Data.tags = data;
          if (data.length > 0) {
            $scope.resetTag(data[0].id);
          }
        });
    };

    // init view
    $scope.init();

    // Watch for changes in Data service
    $scope.$watch(function(scope) { return scope.Data.tags },
      function(newValue, oldValue) {
        $scope.tags = newValue;
      }
    );

    // Listen for event from dialog update
    $scope.$on('tagsUpdate', function() {

      $scope.resetTag(null);

    });

    // Reset item to edit
    $scope.resetTag = function(id) {

      if (id !== null) {
        Data.currentTagIndex = id;
      }
      $scope.tag = TagById.query({id:  Data.currentTagIndex});

    };

    // Update tag
    $scope.updateTag = function() {

      var success = TagUpdate.save({

        id: $scope.tag.id,
        name: $scope.tag.name

      });

      success.$promise.then(function(data) {

        if (data.status === 'success') {
          $scope.tags =TagList.query();
          // Toast upon success
          TaggerToast("Tag Updated");
        }
      })

    };

    // Tag dialogs
    $scope.showDialog = showDialog;
    function showDialog($event, message) {
      TaggerDialog($event, message);
    }

    // Tag dialog messages
    $scope.addMessage = 'templates/addTagMessage.html';
    $scope.deleteMessage = 'templates/deleteTagMessage.html';

  }]);




/*
 *
 *  AREAS CONTROLLER
 *
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

    $scope.Data = Data;
    $scope.areas = Data.areas;

    $scope.init = function() {
      $scope.areas = AreaList.query();
      $scope.areas
        .$promise
        .then(function (data) {
          $scope.Data.areas = data;
          if (data.length > 0) {
            Data.currentAreaIndex =  data[0].id;
            $scope.resetArea(data[0].id);
          }
        });
    };

    // Initialize view
    $scope.init();

    // Watch for changes in Data service
    $scope.$watch(function(scope) { return scope.Data.areas },
      function(newValue, oldValue) {
        $scope.areas = newValue;
      }
    );

    // Listen for events from dialot
    $scope.$on('areasUpdate', function() {

      $scope.resetArea(null);

    });

    // New area to edit
    $scope.resetArea = function() {

      if (id !== null) {
        Data.currentAreaIndex = id;
      }
      $scope.area = AreaById.query({id: Data.currentAreaIndex});

    };

    // Update area
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
          $scope.areas = AreaList.query();
          // Toast upon success
          TaggerToast("Area Updated");
        }
      })

    };

    // dialogs
    $scope.showDialog = showDialog;
    function showDialog($event, message) {
      TaggerDialog($event, message);
    }

    // Area dialog messages
    $scope.addMessage = 'templates/addAreaMessage.html';
    $scope.deleteMessage = 'templates/deleteAreaMessage.html';

  }]);




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
    // init view
    $scope.init();

    // Watch for changes in Data service
    $scope.$watch(function(scope) { return scope.Data.categories },
      function(newValue, oldValue) {
        $scope.categories = newValue;
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



/*
 *
 *  CONTENT TYPES CONTROLLER
 *
 */

taggerControllers.controller('ContentCtrl', [

  '$rootScope',
  '$scope',
  '$animate',
  'TaggerToast',
  'TaggerDialog',
  'ContentTypeList',
  'ContentType',
  'ContentTypeUpdate',
  'ContentTypeDelete',
  'ContentTypeAdd',
  'Data',

  function(
    $rootScope,
    $scope,
    $animate,
    TaggerToast,
    TaggerDialog,
    ContentTypeList,
    ContentType,
    ContentTypeUpdate,
    ContentTypeDelete,
    ContentTypeAdd,
    Data) {

    $scope.Data = Data;
    $scope.contentTypes = Data.contentTypes;


    $scope.init = function() {

      $scope.contentTypes = ContentTypeList.query();
      $scope.contentTypes
        .$promise
        .then(function(data) {
          $scope.Data.contentTypes = data;
          if (data.length > 0) {
            console.log($scope.Data.currentContentIndex);
            $scope.resetType(data[0].id);
          }
        });

    };

    // init view
    $scope.init();

    // Watch for changes in Data service
    $scope.$watch(function(scope) { return scope.Data.contentTypes },
      function(newValue, oldValue) {
        $scope.contentTypes = newValue;
      }
    );

    // Listen event from dialogs
    $scope.$on('contentUpdate', function() {

      $scope.resetType(null);

    });

    // Reset content type to edi
    $scope.resetType = function(id) {

      if (id !== null) {
        Data.currentContentIndex = id;
      }
      $scope.contentType = ContentType.query({id: Data.currentContentIndex});

    };


    // Update content type
    $scope.updateContentType = function() {

      var success = ContentTypeUpdate.save({

        id: $scope.contentType.id,
        name: $scope.contentType.name,
        icon: $scope.contentType.icon

      });

      success.$promise.then(function(data) {

        if (data.status === 'success') {
          $scope.Data.contentTypes = ContentTypeList.query();
          // Toast upon success
          TaggerToast("Content Type Updated");
        }
      })

    };

    // Dialogs
    $scope.showDialog = showDialog;
    function showDialog($event, message) {
      TaggerDialog($event, message);
    }


    // Dialog Messages
    $scope.addMessage = 'templates/addContentMessage.html';
    $scope.deleteMessage = 'templates/deleteContentMessage.html';

  }]);

taggerControllers.controller('TagAreasCtrl', [

  '$scope',
  'TagTargets',
  'TagTargetRemove',
  'TagTargetAdd',
  'TaggerToast',
  'Data',

  function(
    $scope,
    TagTargets,
    TagTargetRemove,
    TagTargetAdd,
    TaggerToast,
    Data ) {

    // Areas have been added to shared Data object
    // by the LayoutCtrl.
    $scope.areas = Data.areas;
    $scope.areaTargets = [];

    $scope.$watch(function() { return Data.currentTagIndex },
      function(newValue, oldValue) {
        if (newValue !== null) {
          $scope.getCurrentAreaTargets(newValue);
        }
      }
    );

    $scope.getCurrentAreaTargets = function(id) {

      $scope.areaTargets = TagTargets.query({tagId: id});

    };


    $scope.isChosen = function(areaId) {

      return findAreaById(areaId);

    };


    $scope.update = function(areaId) {


      if ($scope.areaTargets !== undefined) {

        // If the area id of the selected checkbox is a
        // aleady a target, then delete the area target.
        if (findAreaById(areaId)) {

          var result = TagTargetRemove.query({ tagId: Data.currentTagIndex, areaId: areaId }) ;

          result.$promise.then(function(data) {
            if (data.status == 'success') {
              $scope.areaTargets = result.areaTargets;
              TaggerToast('Tag removed from area.')
            }
          });
        }
        // If the area id of the selected item is
        // not a target already, add a new area target.
        else {
          var result = TagTargetAdd.query({ tagId: Data.currentTagIndex, areaId: areaId });

          result.$promise.then(function(data) {
            if (data.status == 'success') {
              $scope.areaTargets = result.areaTargets;
              TaggerToast('Tag added to Area.')
            }
          });
        }
      }

    };

    function findAreaById(areaId) {
      for (var i = 0; i < $scope.areaTargets.length; i++) {
        console.log($scope.areaTargets[i].AreaId);
        if ($scope.areaTargets[i].AreaId === areaId) {
          return true;
        }
      }
      return false;
    }

  }]);



