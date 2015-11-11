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

      /** @type {number} */
      vm.userAreaId = Data.userAreaId;

      /** @type {Array.string} */
      vm.urlLabels = ['Show entire collection URL', 'Show a selection URL'];

      /** @type {string} */
      vm.browseType = vm.urlLabels[0];



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

      /**
       * Retrieves collection information, tags and
       * content types associated with the collection.
       * @param id  {number} the collection id
       */
      vm.getCollectionById = function (id) {
        Data.currentCollectionIndex = id;
        vm.collectionId = id;

        var col = CollectionById.query({id: id});
        col.$promise.then(function(data) {
          vm.collection = data;
          vm.thumbnailImage = data.image;

        });

        var tags = TagsForCollection
          .query({collId: id});
        tags.$promise.then(function (data) {
          Data.tagsForCollection = data;
        });

        var types = TypesForCollection
          .query({collId: id});
        types.$promise.then(function (data) {
          Data.typesForCollection = data;
        });

      };

      /**
       * Sets vm.browseType string for choosing the URL label.
       * @param type array index
       */
      vm.setBrowseType = function(index) {
          vm.browseType = vm.urlLabels[index];
        console.log(vm.browseType);

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
       * Watch for changes in the shared area id and update the
       * view model collection list and category list.
       */
      $scope.$watch(function() {
         return Data.currentAreaIndex;
      }, function(newValue, oldValue) {

        if (newValue !== oldValue) {
          var cats = CategoryByArea.query({areaId: newValue});
          cats.$promise.then(function() {
             vm.categoryList = cats;
          });
          var collectionList = CollectionsByArea.query(
            {
              areaId: Data.currentAreaIndex
            }
          );
          collectionList.$promise.then(function(data) {
              vm.collectionList = data;
          });

        }
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
      $scope.$watch(function() {return Data.categories},
        function(newValue) {
          if (newValue.length > 0) {
            vm.categoryList =
              CategoryByArea.query({areaId: Data.currentAreaIndex});
          }
        });

    }]);


})();



