
(function() {

  'use strict';


  /**
   * Controller for managing collections.
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
      Data ) {


      var vm = this;

      /** @type {Object} */
      vm.collection = {};

      /** @type {Array.<Object>} */
      vm.collectionList = [];

      /** @type {Array.<Object>} */
      vm.categoryList = [];

      /** @type {number} */
      vm.collectionId = 0;

      /** @type {string} */
      vm.thumbnailImage = '';

      // Tag dialog message templates
      /** @type {string} */
      vm.addMessage = 'templates/addCollectionMessage.html';

      /** @type {string} */
      vm.deleteMessage = 'templates/deleteCollectionMessage.html';

      /** @type {string} */
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
        alert(vm.collection.category);
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

      /**
       * Retrieves collection information as well as tags and
       * content types associated with the collection.
       * @param id  {number} the collection id
       */
      vm.getCollectionById = function (id) {
        Data.currentCollectionIndex = id;
        vm.collectionId = id;
        // collection info
        var col = CollectionById.query({id: id});
        col.$promise.then(function(data) {
          console.log(data);
          vm.collection = data;
          console.log('got collection');
          console.log(vm.collection);
          vm.thumbnailImage = data.image;
        });
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
       * Using event to notify when a collection is removed from a
       * collection area. The removal is done by one of the
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

      /**
       * Watch for updates to the thumbnail image.
       */
      $scope.$watch(function () {
          return Data.currentThumbnailImage
        },
        function (newValue) {
          if (newValue !== null) {
            vm.thumbnailImage = newValue;
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

      /**
       * Watch for updates to the collection category list
       * that is associated with the collection area.
       */
      $scope.$watch(function() {return Data.categoriesForArea},
        function(newValue) {
          if (newValue.length > 0) {
            vm.categoryList = newValue;
          }
        });

    }]);




  /**
   * Controller for managing the association between subject
   * tags and a collection.
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

      /**
       * Filter for the md-autocomplete component.
       * @type {queryTags}
       */
      vm.queryTags = queryTags;

      /** @type {number} */
      vm.selectedItem = null;
      /** @type {string} */
      vm.searchText = null;
      /** @type {boolean} */
      vm.isDisabled = false;
      /** @type {Array.<Object>} */
      vm.selectedTags = [];
      /** @type {Array.<Object>} */
      vm.tagsForArea = [];
      /** @type {Array.<Object>} */
      vm.tagsForCollection = [];

      /**
       * Function called when appending a chip.  The
       * function adds an new subject association for
       * the current collection via db call. Toasts on
       * success.
       * @param chip  {Object} $chip
       * @returns {{id: *, name: *}}
       */
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

      /**
       * Function called when deleting a subject chip.  The function
       * deletes the subject association with this collection
       * via db call. Toasts on success.
       * @param chip  {Object} $chip
       */
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


      /**
       * Watch for changes to the subject tags associated with
       * the collection area.
       */
      $scope.$watch(function () {
          return Data.tagsForArea
        },
        function (newValue) {
          vm.tagsForArea = newValue;
        }
      );

      /**
       * Watch for changes to the subject tags associated with
       * this collection.
       */
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

      /**
       * Creates a regex filter for the search term
       * @param query {string} term to match
       * @returns {Function}
       */
      function createFilterFor(query) {
        var regex = new RegExp(query, 'i');
        return function filterFn(tagItem) {
          if (tagItem.tag.name.match(regex) !== null) {
            return true;
          }
          return false;
        };
      }

      /**
       * Returns filter.
       * @param query
       * @returns {*}
       */
      function queryTags(query) {
        return query ? vm.tagsForArea.filter(createFilterFor(query)) : [];

      }

    }
  ]);


  /**
   * Controller for managing the association between a
   * collection and content types.
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
      Data ) {

      var vm = this;

      /** @type {queryTypes} */
      vm.queryTypes = queryTypes;

      /** {Object} */
      vm.selectedItem = null;

      /** {string} */
      vm.searchText = null;

      /** {boolean} */
      vm.isDisabled = false;

      /** @type {Array.<Object>} */
      vm.selectedTags = [];

      /** @type {Array.<Object>} */
      vm.globalTypes = ContentTypeList.query();

      /** @type {Array.<Object>} */
      vm.typesForCollection = [];


      /**
       * Function called when adding a content type chip.  The
       * function associates the content type with this
       * collection via db call. Toasts on success.
       * @param chip {Object} $chip
       * @returns {{id: *, name: *}}
       */
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

      /**
       * Function called when deleting a content type chip.  The
       * function removes the content type association with this
       * collection via db call. Toasts on success.
       * @param chip {Object} $chip
       */
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


      /**
       * Watch for changes to the list of content t
       */
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

      /**
       * Creates filter for content types
       * @param query  {string} term
       * @returns {Function}
       */
      function createFilterFor(query) {

        var regex = new RegExp(query, 'i');
        return function filterFn(item) {
          if (item.name.match(regex) !== null) {
            return true;
          }
          return false;
        };
      }

      /**
       * Returns filter
       * @param query {string} term
       * @returns {*}
       */
      function queryTypes(query) {
        return query ? vm.globalTypes.filter(createFilterFor(query)) : [];

      }

    }

  ]);


  /**
   * Controller for managing the association between a collection
   * and collection areas.
   */
  taggerControllers.controller('CollectionAreasCtrl', [

    '$rootScope',
    '$scope',
    'AreasForCollection',
    'AreaTargetRemove',
    'AreaTargetAdd',
    'TaggerToast',
    'Data',

    function (
      $rootScope,
      $scope,
      AreasForCollection,
      AreaTargetRemove,
      AreaTargetAdd,
      TaggerToast,
      Data ) {

      var vm = this;


      /** @type {Array.<Object>} */
      vm.areas = Data.areas;

      /** @type {Array.<Object>} */
      vm.areaTargets = [];

      /**
       * Searches for area id in the current list of
       * area associations.
       * @param areaId  {number} the area ID
       * @param tar  {Array.<Object>} the areas associated with the collection.
       * @returns {boolean}
       */
      var findArea = function(areaId, tar) {
        var targets = tar;
        for (var i = 0; i < targets.length; i++) {
          if (targets[i].AreaId === areaId) {
            return true;
          }
        }
        return false;
      };

      /**
       * Gets the list of areas associated with the current
       * collection
       * @param id  {number} the collection id
       */
      vm.getCurrentAreaTargets = function (id) {
        vm.areaTargets = AreasForCollection.query({collId: id});

      };

      /**
       * Tests to see if the collection area is currently
       * associated with this collection.
       * @param areaId   {number} area ID
       * @returns {boolean}
       */
      vm.isChosen = function (areaId) {
        return findArea(areaId, vm.areaTargets);

      };

      /**
       * Adds or removes the association between a collection and a
       * collection area.  If the association already exists, it is
       * removed.  If it is a new association, it is added. Toasts
       * on success.
       * @param areaId  {number} the area ID
       */
      vm.update = function (areaId) {

        if (vm.areaTargets !== undefined) {
          // If the area id of the selected checkbox is a
          // already a target, then delete the area target.
          if (findArea(areaId, vm.areaTargets)) {
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

      /**
       * Watches for change in the collection index and retrieves areas
       * associated with the new collection.
       */
      $scope.$watch(function () {
          return Data.currentCollectionIndex
        },
        function (newValue) {
          if (newValue !== null) {
            vm.getCurrentAreaTargets(newValue);
          }
        }
      );

      /**
       * Watch for change in the list of collection areas. Update
       * view model.
       */
      $scope.$watch(function () {
          return Data.areas
        },
        function (newValue) {
          vm.areas = newValue;
        }
      );


    }]);

})();



