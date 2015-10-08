
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

      /** @type {Array.<Object>} */
      vm.areas = [];

      /** @type {number} */
      vm.currentId = 0;

      var areas = AreaList.query();
      /**
       * Upon resolution, set the area data and call
       * the context initialization method setContext()
       */
      areas.$promise.then(function(data) {
        vm.areas = data;
        Data.areas = data;
        Data.areaLabel = data[0].title;
        if (Data.currentAreaIndex === null) {
          Data.currentAreaIndex = data[0].id;
          vm.currentId = data[0].id;
        }

        setContext(Data.currentAreaIndex);

      });

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

      $scope.$watch(function() { return Data.areas; },
        function(newValue) {
          vm.areas = newValue;
      });


      /**
       * Initializes the shared Data context.
       * @param id   the area id
       */
      function setContext(id) {

        updateAreaContext(id);

        // Initialize global categories.
        var categories = CategoryList.query();
        categories.$promise.then(function(data) {
          Data.categories = data;
          Data.currentCategoryIndex = data[0].id;
        });

        // Initialize global tags.
        var tags = TagList.query();
        tags.$promise.then(function(data) {
          if (data.length > 0) {
            Data.tags = data;
            Data.currentTagIndex = data[0].id
          }
        });
        // Initialize global content types
        var types = ContentTypeList.query();
        types.$promise.then(function(data) {
          if (data.length > 0) {
            Data.contentTypes = data;
            Data.currentContentIndex = data[0].id;
          }

        });

      }

      /**
       * Updates the shared Data context.
       * @param id   the area id
       */
      function updateAreaContext(id) {
        // Set collections for area collections.
        var collections = CollectionsByArea.query({areaId: id});
        collections.$promise.then(function(data) {
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
        tagsForArea.$promise.then(function(data) {
          if (data.length > 0) {
            Data.tagsForArea = data;
          }
        });
        var categoriesForArea = CategoryByArea.query({areaId: id});
        categoriesForArea.$promise.then(function(categories) {
             if (categories.length > 0) {
               Data.categoriesForArea = categories;
             }
        });

      }

    }]);


})();


