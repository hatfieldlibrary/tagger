
/*
 *  COLLECTIONS CONTROLLERS
 *
 *  Four controllers:
 *  CollectionsCrtl,
 *  TagFilterCtrl,
 *  ContentTypeFilterCtrl,
 *  CollectionAreasCtrl
 *
 */

(function() {

  'use strict';

  /**
   * Controller for collections.
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

    function (
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
      Data) {


      var vm = this;

      /** @type {Object} */
      vm.collection = {};
      /** @type {Array.<Object>} */
      vm.collectionList = [];
      /** @type {string} */
      vm.thumbnailImage = '';
      // Tag dialog message templates
      /** @type {string} */
      vm.addMessage = 'templates/addCollectionMessage.html';
      vm.deleteMessage = 'templates/deleteCollectionMessage.html';
      vm.updateImageMessage = 'templates/updateImageMessage.html';

      /**
       * Show the $mdDialog.
       * @param $event click event object (location of event used as
       *                    animation starting point)
       * @param message  html to display in dialog
       */
      vm.showDialog = function ($event, message) {
        TaggerDialog($event, message);
      };


      /**
       * Updates the collection and reloads the collection
       * list for the current area upon success.
       */
      vm.updateCollection = function () {

        var update = CollectionUpdate.save({
          id: vm.collection.id,
          title: vm.collection.title,
          url: vm.collection.url,
          description: vm.collection.description,
          dates: vm.collection.dates,
          repoType: vm.collection.repoType,
          category: vm.collection.category,
          items: vm.collection.items,
          browseType: vm.collection.browseType,
          restricted: vm.collection.restricted,
          ctype: vm.collection.ctype

        });
        update.$promise.then(function (data) {
          if (data.status === 'success') {
            vm.collectionList = CollectionsByArea.query(
              {
                areaId: Data.currentAreaIndex
              }
            );
            // Toast upon success
            TaggerToast("Collection Updated");
          }
        })

      };

   //   vm.getCollectionArea = function (id) {
    //    Data.currentCollectionIndex = id;
    //    vm.collectionList = CollectionsByArea.query({id: id});

    //  };


      /**
       * Retrieves collection information as well as tags and
       * content types associated with the collection.
       * @param id  the collection id
       */
      vm.getCollectionById = function (id) {
        Data.currentCollectionIndex = id;
        // collection info
        vm.collection = CollectionById.query({id: id});
        // tag info
        var tags = TagsForCollection
          .query({collId: id});
        tags.$promise.then(function (data) {
          Data.tagsForCollection = data;
        });
        // type info
        var types = TypesForCollection
          .query({collId: id});
        types.$promise.then(function (data) {
          Data.typesForCollection = data;
        });

      };


      /**
       * Using event for the image update.  See dialog controller.
       */
      $scope.$on('imageUpdate', function () {
      //  vm.collection.image = Data.currentThumbnailImage;
      });

      /**
       * Using event to notify when a collection is removed from a
       * collection area. The actual removal is done by one of the
       * controllers below, so perhaps a variable or object in the
       * parent scope could be used instead. There is no need to
       * update the shared Data service, although that's another
       * possibility.
       *
       * Updates the collection list on event.
       */
      $scope.$on('removedFromArea', function () {
        vm.collectionList = CollectionsByArea.query(
          {
            areaId: Data.currentAreaIndex
          }
        );
      });


      /**
       * Watch for updates to the list of areas.
       */
      $scope.$watch(function () {
          return Data.areas
        },
        function (newValue) {
          if (newValue != $scope.areas) {
            vm.areas = newValue;
          }
        }
      );

      // not sure this is used
      $scope.$watch(function () {
          return Data.currentThumbnailImage
        },
        function (newValue) {
          if (newValue !== null) {
            vm.currentThumbnailImage = newValue;
          }
        });

      /**
       * Watch for updates to the current context collection
       * id. Update the selected collection information.
       */
      $scope.$watch(function () {
          return Data.currentCollectionIndex
        },
        function (newValue) {
          if (newValue !== null) {
            vm.getCollectionById(newValue);
          }
        });

      /**
       * Watch for updates to the current context collection
       * list. Update the collectionList field in response.
       */
      $scope.$watch(function () {
          return Data.collections
        },
        function () {
          vm.collectionList = Data.collections;
        }
      );

    }]);


  /**
   * Controller for the tags
   */
  taggerControllers.controller('TagFilterCtrl', [

    '$scope',
    'TagsForArea',
    'CollectionTagTargetAdd',
    'CollectionTagTargetRemove',
    'TaggerToast',
    'Data',
    function (
      $scope,
      TagsForArea,
      CollectionTagTargetAdd,
      CollectionTagTargetRemove,
      TaggerToast,
      Data) {

      var vm = this;
      vm.searchTextChange = searchTextChange;
      vm.selectedItemChange = selectedItemChange;
      vm.queryTags = queryTags;
      vm.selectedItem = null;
      vm.searchText = null;
      vm.isDisabled = false;
      vm.selectedTags = [];

      vm.tagsForArea = [];
      vm.tagsForCollection = [];


      vm.addTag = function (chip) {

        var chipObj = {id: chip.tag.id, name: chip.tag.name};

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

      vm.removeTag = function (chip) {
        console.log('current collection ' + Data.currentCollectionIndex);
        console.log('got chip id ' + chip.id);
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
      $scope.$watch(function () {
          return Data.tagsForArea
        },
        function (newValue) {
          vm.tagsForArea = newValue;
        }
      );

      $scope.$watch(function () {
          return Data.tagsForCollection
        },

        function (newValue) {
          if (newValue.length > 0) {
            var objArray = [];
            for (var i = 0; i < newValue.length; i++) {
              objArray[i] = {id: newValue[i].id, name: newValue[i].name};
            }
            vm.tagsForCollection = objArray;
          } else {
            vm.tagsForCollection = [];
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

      function queryTags(query) {

        var results = query ? vm.tagsForArea.filter(createFilterFor(query)) : [];
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
    function (
      $scope,
      ContentTypeList,
      TypesForCollection,
      CollectionTypeTargetRemove,
      CollectionTypeTargetAdd,
      TaggerToast,
      Data) {

      var vm = this;
      vm.searchTextChange = searchTextChange;
      vm.selectedItemChange = selectedItemChange;
      vm.queryTypes = queryTypes;
      vm.selectedItem = null;
      vm.searchText = null;
      vm.isDisabled = false;
      vm.selectedTags = [];
      vm.globalTypes = ContentTypeList.query();
      vm.typesForCollection = [];


      vm.addType = function (chip) {

        var chipObj = {id: chip.id, name: chip.name};

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

      vm.removeType = function (chip) {
        console.log('current collection ' + Data.currentCollectionIndex);
        console.log('got chip id ' + chip.id);
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


      $scope.$watch(function () {
          return Data.typesForCollection
        },
        function (newValue) {
          if (newValue.length > 0) {
            var objArray = [];
            for (var i = 0; i < newValue.length; i++) {
              console.log(newValue[i]);
              objArray[i] = {id: newValue[i].itemContent.id, name: newValue[i].itemContent.name};

            }
            vm.typesForCollection = objArray;

          } else {
            vm.typesForCollection = [];
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

      function queryTypes(query) {

        var results = query ? vm.globalTypes.filter(createFilterFor(query)) : [];
        return results;

      }

    }
  ]);


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
    'FindAreaById',
    'TaggerToast',
    'Data',

    function (
      $rootScope,
      $scope,
      AreasForCollection,
      AreaTargetRemove,
      AreaTargetAdd,
      FindAreaById,
      TaggerToast,
      Data) {

      var vm = this;
      // Areas have been added to shared Data object
      // by the LayoutCtrl.
      vm.areas = Data.areas;
      vm.areaTargets = [];



      vm.getCurrentAreaTargets = function (id) {
        vm.areaTargets = AreasForCollection.query({collId: id});

      };


      vm.isChosen = function (areaId) {
        return FindAreaById(areaId, vm.areaTargets);

      };


      vm.update = function (areaId) {

        if (vm.areaTargets !== undefined) {
          // If the area id of the selected checkbox is a
          // already a target, then delete the area target.
          if (findAreaById(areaId, vm.areaTargets)) {

            if (vm.areaTargets.length === 1) {
              TaggerToast('Cannot remove area.  Collections must belong to at least one area.');

            } else {
              var result = AreaTargetRemove.query({collId: Data.currentCollectionIndex, areaId: areaId});
              result.$promise.then(function (data) {
                if (data.status == 'success') {
                  vm.areaTargets = result.areaTargets;
                  $rootScope.$broadcast('removedFromArea');
                  TaggerToast('Collection removed from area.')
                }
              });
            }
          }

          // If the area id of the selected item is
          // not a target already, add a new area target.
          else {
            var result = AreaTargetAdd.query({collId: Data.currentCollectionIndex, areaId: areaId});
            result.$promise.then(function (data) {
              if (data.status == 'success') {
                vm.areaTargets = result.areaTargets;
                TaggerToast('Collection added to Area.')
              }
            });
          }
        }

      };

      $scope.$watch(function () {
          return Data.currentCollectionIndex
        },
        function (newValue, oldValue) {
          if (newValue !== null) {
            vm.getCurrentAreaTargets(newValue);
          }
        }
      );

      $scope.$watch(function () {
          return Data.areas
        },
        function (newValue) {
          $scope.areas = newValue;
        }
      );


    }]);




})();



