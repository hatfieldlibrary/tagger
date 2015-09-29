
'use strict';

var taggerControllers = angular.module('taggerControllers', []);


function getUserRole(areaId) {

  if (areaId === 0) {
    return 'Administrator';
  } else {
    return 'Area Maintainer';
  }

}

/*
 *
 *  TOP-LEVEL LAYOUT CONTROLLER
 *
 */

taggerControllers.controller('LayoutCtrl', [
  '$scope',
  'AreaList',
  'Data',
  function(
    $scope,
    AreaList,
    Data ) {

    $scope.Data = Data;
    $scope.areas = AreaList.query();
    $scope.areas.$promise.then(function(data) {
      Data.areas = data;
      if (Data.currentAreaIndex === null) {
        Data.currentAreaIndex = $scope.areas[0].id;
      }

    });

    $scope.updateArea = function(id) {
      $scope.Data.currentAreaIndex = id;
      Data.currentAreaIndex = id;
    };

    $scope.getRole = function(areaId) {
      Data.userAreaId = areaId;
      $scope.role = getUserRole(areaId);

    };

  }]);


/*
 *
 *  USERS CONTROLLER
 *
 */

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
    Data
  ) {

    var areaList = [];

    $scope.areas = areaList;

    $scope.newRow = function() {
        $scope.users[$scope.users.length] = {id: null, name:'', email:'', area:''};
    };

    function setUsers() {
      var users = UserList.query();
      users.$promise.then(function(list) {
        console.log(users);
        var arr = [];
        if (list.length > 0) {
          for (var i = 0; i < list.length; i++) {
             arr[i] = {id: list[i].id, name: list[i].name, email: list[i].email, area: list[i].area};
          }
        }
        $scope.users = arr;
      });
    }

    $scope.updateUser = function(id, name, email, area) {

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

    $scope.deleteUser = function(id) {

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
    $scope.$watch(function() { return Data.areas },
      function(newValue) {
        if (newValue.length > 0) {
          areaList[0] = {id: 0, name: 'Administrator'};
          for (var i = 0; i < newValue.length; i++) {
            areaList[i + 1] = {id: newValue[i].id, name: newValue[i].title};
          }
        }
      }
    );



  }
]);

/*
 *
 *  TAGS PANEL CONTROLLER
 *
 */

taggerControllers.controller('TagFilterCtrl', [
  '$scope',
  'TagsForArea',
  'CollectionTagTargetAdd',
  'CollectionTagTargetRemove',
  'TaggerToast',
  'Data',
  function(
    $scope,
    TagsForArea,
    CollectionTagTargetAdd,
    CollectionTagTargetRemove,
    TaggerToast,
    Data) {

    var self = this;
    self.searchTextChange = searchTextChange;
    self.selectedItemChange = selectedItemChange;
    self.queryTags = queryTags;
    self.selectedItem = null;
    self.searchText = null;
    self.isDisabled    = false;
    self.selectedTags = [];

    self.tagsForArea = [];
    self.tagsForCollection = [];



    self.addTag = function(chip) {

      var chipObj =  {id: chip.tag.id, name: chip.tag.name};

      var result = CollectionTagTargetAdd.query(
        {
          collId: Data.currentCollectionIndex,
          tagId: chip.tag.id
        }
      );

      result.$promise.then(function (data) {
        if (data.status == 'success') {

          TaggerToast('Subject Tag Added');

        } else {
          return {};
          TaggerToast('WARNING: Unable to add subject tag!');

        }
      });

      return chipObj;

    };

    self.removeTag = function(chip) {
      console.log('current collection ' + Data.currentCollectionIndex);
      console.log('got chip id ' +chip.id);
      var result = CollectionTagTargetRemove.query(
        {
          collId: Data.currentCollectionIndex,
          tagId: chip.id
        }
      );

      result.$promise.then(function (data) {
        if (data.status == 'success') {
          TaggerToast('Subject Tag Removed');
        } else {
          TaggerToast('WARNING: Unable to remove subject tag!');
        }
      });
    };



    // Watch for changes on shared context object.
    $scope.$watch(function() { return Data.tagsForArea },
      function(newValue) {
          self.tagsForArea = newValue;
      }
    );

    $scope.$watch(function() { return Data.tagsForCollection },

      function(newValue) {
        if (newValue.length > 0) {
          var objArray = [];
          for (var i = 0; i < newValue.length; i++) {
            objArray[i] = {id: newValue[i].id, name: newValue[i].name};
          }
          self.tagsForCollection = objArray;
        }  else {
          self.tagsForCollection = [];
        }
      }

    );


    function searchTextChange(text) {
      console.log('Text changed to ' + text);
    }

    function selectedItemChange(item) {
      console.log('Item changed to ' + JSON.stringify(item));
    }


    function createFilterFor(query) {

      var regex = new RegExp(query, 'i');
      return function filterFn(tagItem) {
        if (tagItem.tag.name.match(regex) !== null) {
          return true;
        }
        return false;
      };
    }

    function queryTags (query) {

      var results = query ? self.tagsForArea.filter(createFilterFor(query)) : [];
      return results;

    }

  }
]);


/*
 *
 *  TYPE PANEL CONTROLLER
 *
 */

taggerControllers.controller('ContentTypeFilterCtrl', [
  '$scope',
  'ContentTypeList',
  'TypesForCollection',
  'CollectionTypeTargetRemove',
  'CollectionTypeTargetAdd',
  'TaggerToast',
  'Data',
  function(
    $scope,
    ContentTypeList,
    TypesForCollection,
    CollectionTypeTargetRemove,
    CollectionTypeTargetAdd,
    TaggerToast,
    Data) {

    var self = this;
    self.searchTextChange = searchTextChange;
    self.selectedItemChange = selectedItemChange;
    self.queryTypes = queryTypes;
    self.selectedItem = null;
    self.searchText = null;
    self.isDisabled    = false;
    self.selectedTags = [];
    self.globalTypes = ContentTypeList.query();
    self.typesForCollection = [];




    self.addType = function(chip) {

      var chipObj =  {id: chip.id, name: chip.name};

      var result = CollectionTypeTargetAdd.query(
        {
          collId: Data.currentCollectionIndex,
          typeId: chip.id
        }
      );

      result.$promise.then(function (data) {
        if (data.status == 'success') {
          TaggerToast('Subject Tag Added');

        } else {

          TaggerToast('WARNING: Unable to add subject tag!');

        }
      });

      return chipObj;

    };

    self.removeType = function(chip) {
      console.log('current collection ' + Data.currentCollectionIndex);
      console.log('got chip id ' +chip.id);
      var result = CollectionTypeTargetRemove.query(
        {
          collId: Data.currentCollectionIndex,
          typeId: chip.id
        }
      );

      result.$promise.then(function (data) {
        if (data.status == 'success') {
          TaggerToast('Subject Tag Removed');
        } else {
          TaggerToast('WARNING: Unable to remove subject tag!');
        }
      });
    };



    $scope.$watch(function() { return Data.typesForCollection },

      function(newValue) {


        if (newValue.length > 0) {

          var objArray = [];
          for (var i = 0; i < newValue.length; i++) {
            console.log( newValue[i]) ;
            objArray[i] = {id: newValue[i].itemContent.id, name: newValue[i].itemContent.name};
          }
          self.typesForCollection = objArray;

        }  else {
          self.typesForCollection = [];
        }
      }

    );


    function searchTextChange(text) {
      console.log('Text changed to ' + text);
    }

    function selectedItemChange(item) {
      console.log('Item changed to ' + JSON.stringify(item));
    }


    function createFilterFor(query) {

      var regex = new RegExp(query, 'i');
      return function filterFn(item) {
        if (item.name.match(regex) !== null) {
          return true;
        }
        return false;
      };
    }

    function queryTypes (query) {

      var results = query ? self.globalTypes.filter(createFilterFor(query)) : [];
      return results;

    }

  }
]);



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
  'TagsForArea',
  'CategoryList',
  'CategoryByArea',
  'TaggerDialog',
  'TaggerToast',
  'Data',

  function(
    $scope,
    $resource,
    CollectionsByArea,
    CollectionById,
    CollectionUpdate,
    TagsForCollection,
    TypesForCollection,
    TagsForArea,
    CategoryList,
    CategoryByArea,
    TaggerDialog,
    TaggerToast,
    Data ) {




    $scope.Data = Data;
    $scope.areas = Data.areas;
    $scope.collectionList = [];


    // Listen for event from image update.
    $scope.$on('imageUpdate', function() {
      $scope.collection.image = Data.currentThumbnailImage;
    });
    // Listed for removed from current area event.
    $scope.$on('removedFromArea', function() {
      $scope.collectionList = CollectionsByArea.query({areaId: Data.currentAreaIndex});
    });


    // Watch for changes on shared context object.
    $scope.$watch(function() { return Data.areas },
      function(newValue) {
        if (newValue != $scope.areas) {
          $scope.areas = newValue;
        }
      }
    );

    $scope.$watch(function() { return Data.currentAreaIndex },
      function(newValue, oldValue) {
        // this is the initial page load
        console.log(oldValue);
        if (oldValue === newValue) {
          $scope.Data.currentAreaIndex = newValue;
          $scope.collectionList = Data.collections;
          $scope.init();
        } else {

          // this is a subsequent area update
          if (newValue !== null) {
            $scope.Data.currentAreaIndex = newValue;
            $scope.collectionList = CollectionsByArea.query({areaId: newValue});
            $scope.collectionList.$promise.then(function (data) {
              if (typeof data !== 'undefined') {
                Data.collections = data;
                Data.currentCollectionIndex = data[0].collection.id;
                $scope.collection = data[0].collection;

              }
            });
            $scope.categoryList = CategoryByArea.query({areaId: Data.currentAreaIndex});
            $scope.tagsForArea = TagsForArea.query({areaId: $scope.Data.currentAreaIndex});
            $scope.tagsForArea.$promise.then(function (data) {
              Data.tagsForArea = data;
            });
          }
        }
      }
    );

    $scope.$watch(function() { return Data.currentThumbnailImage},
      function(newValue) {
        if (newValue !== null) {
          $scope.Data.currentThumbnailImage = newValue;
        }
      });


    $scope.$watch(function() {return Data.currentCollectionIndex},
      function(newValue) {
        if (newValue !== null) {
          $scope.getCollectionById(newValue);
        }
      });


    $scope.$watch(function() { return Data.collections},
      function() {
        $scope.collectionList = Data.collections;
      }
    );


    // Initialization method, called on load.
    $scope.init = function() {

      Data.tagsForCollection = [];
      Data.typesForCollection = [];

      //if ($scope.Data.currentAreaIndex !== null ) {
        $scope.collectionList = CollectionsByArea.query({areaId: Data.currentAreaIndex});

        $scope.collectionList.$promise.then(function (data) {
          if (typeof data !== 'undefined') {
            Data.collections = data;
            Data.currentCollectionIndex = data[0].collection.id;
            $scope.collection = data[0].collection;

          }
          $scope.categoryList = CategoryByArea.query({areaId: Data.currentAreaIndex});
          $scope.tagsForArea = TagsForArea.query({areaId: Data.currentAreaIndex});
          $scope.tagsForArea.$promise.then(function (data) {
            Data.tagsForArea = data;
          });

          Data.tagsForCollection = TagsForCollection
            .query({collId: data[0].CollectionId});

          Data.typesForCollection = TypesForCollection
            .query({collId: data[0].CollectionId});


        });
     // }
    };



    // Update Collection information
    $scope.updateCollection = function() {

      var success = CollectionUpdate.save({

        id: $scope.collection.id,
        title: $scope.collection.title,
        url: $scope.collection.url,
        description: $scope.collection.description,
        dates: $scope.collection.dates,
        repoType: $scope.collection.repoType,
        category: $scope.collection.category,
        items: $scope.collection.items,
        browseType: $scope.collection.browseType,
        restricted: $scope.collection.restricted,
        ctype: $scope.collection.ctype

      });

      success.$promise.then(function(data) {

        if (data.status === 'success') {
          $scope.collectionList = CollectionsByArea.query({areaId: $scope.Data.currentAreaIndex});
          // Toast upon success
          TaggerToast("Collection Updated");
        }
      })

    };


    $scope.getCollectionArea = function(id) {

      Data.currentCollectionIndex = id;
      $scope.collectionList = CollectionsByArea.query({id: id});

    };



    /*
     $scope.getTagsForCollection = function(id) {

     $scope.collectionTags = TagsForCollection(id);

     };
     */

    $scope.getCollectionById = function(id) {

      $scope.Data.currentCollectionIndex = id;
      $scope.collection = CollectionById.query({id: id});
      var tags = TagsForCollection
        .query({collId: id});
      tags.$promise.then(function(data) {
         Data.tagsForCollection = data;
      });
      var types = TypesForCollection
        .query({collId: id});
      types.$promise.then(function(data) {
        Data.typesForCollection = data;
      });

    };


    // Tag dialog messages
    $scope.addMessage = 'templates/addCollectionMessage.html';
    $scope.deleteMessage = 'templates/deleteCollectionMessage.html';
    $scope.updateImageMessage = 'templates/updateImageMessage.html';

    // Dialog function.  Uses md-dialog directive via TaggerDialog service.
    $scope.showDialog = showDialog;
    function showDialog($event, message) {
      TaggerDialog($event, message);
    }


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

      $scope.Data.tags = Data.tags;
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

    // Listen for events from dialog
    $scope.$on('areasUpdate', function() {

      $scope.resetArea(null);

    });

    // New area to edit
    $scope.resetArea = function(id) {

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

    $scope.$watch(function() { return Data.areas },
      function(newValue, oldValue) {
        $scope.areas = newValue;
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


function findAreaById(areaId, targets) {
  for (var i = 0; i < targets.length; i++) {
    if (targets[i].AreaId === areaId) {
      return true;
    }
  }
  return false;
}


/*
 *
 *  COLLECTION AREA CONTROLLER
 *
 */

taggerControllers.controller('CollectionAreasCtrl', [

  '$rootScope',
  '$scope',
  'AreasForCollection',
  'AreaTargetRemove',
  'AreaTargetAdd',
  'TaggerToast',
  'Data',

  function(
    $rootScope,
    $scope,
    AreasForCollection,
    AreaTargetRemove,
    AreaTargetAdd,
    TaggerToast,
    Data ) {

    // Areas have been added to shared Data object
    // by the LayoutCtrl.
    $scope.areas = Data.areas;
    $scope.areaTargets = [];

    $scope.$watch(function() { return Data.currentCollectionIndex },
      function(newValue, oldValue) {
        if (newValue !== null) {
          $scope.getCurrentAreaTargets(newValue);
        }
      }
    );

    $scope.$watch(function() { return Data.areas},
      function(newValue) {
        $scope.areas = newValue;
      });

    $scope.getCurrentAreaTargets = function(id) {

      $scope.areaTargets = AreasForCollection.query({collId: id});

    };


    $scope.isChosen = function(areaId) {

      return findAreaById(areaId, $scope.areaTargets);

    };


    $scope.update = function(areaId) {
      console.log('update') ;

      if ($scope.areaTargets !== undefined) {


        // If the area id of the selected checkbox is a
        // already a target, then delete the area target.
        if (findAreaById(areaId, $scope.areaTargets)) {

          if ($scope.areaTargets.length === 1) {

            TaggerToast('Cannot remove area.  Collections must belong to at least one area.');

          } else {

            var result = AreaTargetRemove.query({collId: Data.currentCollectionIndex, areaId: areaId});
            result.$promise.then(function (data) {
              if (data.status == 'success') {
                $scope.areaTargets = result.areaTargets;
                $rootScope.$broadcast('removedFromArea');
                TaggerToast('Collection removed from area.')
              }
            });
          }
        }

        // If the area id of the selected item is
        // not a target already, add a new area target.
        else {

          var result = AreaTargetAdd.query({ collId: Data.currentCollectionIndex, areaId: areaId });

          result.$promise.then(function(data) {
            if (data.status == 'success') {
              $scope.areaTargets = result.areaTargets;
              TaggerToast('Collection added to Area.')
            }
          });
        }
      }

    };

  }]);


/*
 *
 *  TAG AREA CONTROLLER
 *
 */

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

    $scope.$watch(function() { return Data.areas},
      function(newValue) {
        $scope.areas = newValue;
      });

    $scope.getCurrentAreaTargets = function(id) {

      $scope.areaTargets = TagTargets.query({tagId: id});

    };


    $scope.isChosen = function(areaId) {

      return findAreaById(areaId, $scope.areaTargets);

    };


    $scope.update = function(areaId) {


      if ($scope.areaTargets !== undefined) {

        // If the area id of the selected checkbox is a
        // aleady a target, then delete the area target.
        if (findAreaById(areaId, $scope.areaTargets)) {

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

  }]);



