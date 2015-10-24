
(function() {

  'use strict';

  /**
   * Layout controller for updating the collection area.
   * This controller initializes and updates the singleton
   * used by other controllers.  It effectively initializes
   * the application and updates global state.
   */
  taggerControllers.controller('LayoutCtrl', [
    '$scope',
    'AreaList',
    'CollectionsByArea',
    'TagsForCollection',
    'TypesForCollection',
    'CategoryList',
    'CategoryByArea',
    'ContentTypeList',
    'TagList',
    'TagsForArea',
    'Data',
    function(
      $scope,
      AreaList,
      CollectionsByArea,
      TagsForCollection,
      TypesForCollection,
      CategoryList,
      CategoryByArea,
      ContentTypeList,
      TagList,
      TagsForArea,
      Data ) {

      var vm = this;

      /** @type {number} */
      vm.currentIndex = 0;

      /** @type {Array.<Object>} */
      vm.areas = [{title:'a', id:0}];

      /** @type {number} */
      vm.currentId = 0;

      /** @type {number} */
      vm.userAreaId = 0;


      var init = function() {
        var areas = AreaList.query();
        /**
         * Upon resolution, set the area data and call
         * the context initialization method setContext()
         */
        areas.$promise.then(function (data) {

          vm.areas = data;
          Data.areas = data;
          Data.areaLabel = data[0].title;
          vm.currentId = data[0].id;
          // Initialize current area to first item
          // in the data array.
          if (Data.currentAreaIndex === null) {
            Data.currentAreaIndex = data[0].id;

          }
          if (Data.userAreaId === 0) {
            if (Data.areas.length > 0) {
              Data.currentAreaIndex = Data.areas[0].id;
            }
          }
          getAreaLabel(Data.currentAreaIndex);
          setContext(Data.currentAreaIndex);

        });
      };



      /**
       * Update the current area.
       * @param id the area id
       * @param index the position of the area in the
       *          current area array
       */
      vm.updateArea = function(id, index) {
        Data.currentAreaIndex = id;
        Data.areaLabel = Data.areas[index].title;
        updateAreaContext(id);

      };

      vm.setCurrentIndex = function(index) {
        vm.currentIndex = index;

      };

      /**
       * Initializes the shared Data context.
       * @param id   the area id
       */
      function setContext(id) {

        updateAreaContext(id);

        if (id !== null && id !== undefined) {
          // Initialize global categories.
          var categories = CategoryList.query();
          categories.$promise.then(function (data) {
            Data.categories = data;
            Data.currentCategoryIndex = data[0].id;
          });

          // Initialize global tags.
          var tags = TagList.query();
          tags.$promise.then(function (data) {
            if (data.length > 0) {
              Data.tags = data;
              Data.currentTagIndex = data[0].id
            }
          });

          // Initialize global content types
          var types = ContentTypeList.query();
          types.$promise.then(function (data) {
            if (data.length > 0) {
              Data.contentTypes = data;
              Data.currentContentIndex = data[0].id;
            }

          });
        }

      }

      /**
       * Updates the shared Data context.
       * @param id   the area id
       */
      function updateAreaContext(id) {

        if (id !== null && id !== undefined) {
          // Set collections for area collections.
          var collections = CollectionsByArea.query({areaId: id});
          collections.$promise.then(function (data) {
            if (data !== undefined) {
              if (data.length > 0) {
                Data.collections = data;
                Data.currentCollectionIndex = data[0].collection.id;
                Data.tagsForCollection =
                  TagsForCollection.query({collId: Data.currentCollectionIndex});
                Data.typesForCollection =
                  TypesForCollection.query({collId: Data.currentCollectionIndex});
              }
            }

          });
          // Set subject tags for area.
          var tagsForArea = TagsForArea.query({areaId: id});
          tagsForArea.$promise.then(function (data) {
            if (data.length > 0) {
              Data.tagsForArea = data;
            }
          });
          var categoriesForArea = CategoryByArea.query({areaId: id});
          categoriesForArea.$promise.then(function (categories) {
            if (categories.length > 0) {
              Data.categoriesForArea = categories;
            }
          });
        }
      }

      /**
       * Sets the view model's user id and
       * initializes the application state for
       * the corresponding area. If the user id
       * is 0 (administrator) initialize using
       * the id of the first area in the current
       * area list.
       */
      $scope.$watch(function() { return Data.userAreaId },
        function(newValue, oldValue) {
          vm.userAreaId = newValue;
          var id = '';
          if (newValue === 0) {
            init();
          }
          else {
            id = newValue;
            // For non-administrative user, initialize current area to the
            // user's area id.
            Data.currentAreaIndex = id;
            vm.currentId = id;
          }

        });


      /**
       * Updates the area list and selected area id
       * values when areas change.   Changes occur when
       * area is added or deleted, or when the position
       * attribute of the area is changed.
       */
      $scope.$watch(function() { return Data.areas; },
        function(newValue, oldValue) {
          if (newValue !== oldValue) {
            if (newValue > 0) {
              vm.currentId = Data.currentAreaIndex;
              vm.areas = newValue;
            }
          }

        });


      /**
       * Look up area label.
       * @param id  the area id
       */
      function getAreaLabel(id) {
        for (var i = 0; i < Data.areas.length; i++) {
          if (Data.areas[i].id === id) {
            Data.areaLabel = Data.areas[i].title;
            vm.areaLabel = Data.areas[i].title;
            return;
          }
        }
      }

    }]);

})();


