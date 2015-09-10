
'use strict';

var taggerControllers = angular.module('taggerControllers', []);

taggerControllers.controller('CollectionCtrl',
  ['$scope', '$resource','CollectionsByArea','CollectionById','TagsForCollection','TypesForCollection', 'Data',
    function($scope, $resource, CollectionsByArea, CollectionById, TagsForCollection, TypesForCollection,  Data ) {


      $scope.getCollectionArea = function(id) {

        $scope.collectionList = CollectionsByArea.query({id: id});

      };


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



      $scope.testData = {
        title: 'Chloe Clarke Willson journal ',
        description: 'The Chloe Clarke Willson journal documents Willson\'s journey aboard ' +
        'the ship Lausanne and her experiences as a Methodist missionary teacher at the Oregon Institute ' +
        '(later Willamette University) in Salem, Oregon. The Chloe Clarke Willson journal documents Willson\'s journey aboard ' +
        'the ship Lausanne and her experiences as a Methodist missionary teacher at the Oregon Institute ' +
        '(later Willamette University) in Salem, Oregon.',
        category: "Personal Collections",
        area: 'University Archives',
        dates: '1839-1849',
        count: '1',
        itemType: 'item',
        contentType: 'document',
        browseType: 'link',
        searchType: 'browse_only',
        restricted: "no",
        url: 'http://libmedia.willamette.edu/cview/archives.html#!doc:page:manuscripts/1645',
        thumbnail: 'http://libmedia.willamette.edu/resources/img/thumb/ChloeAureliaClarkeWillson.png',
        tags: ['cheese', 'rhubarb'],
        categories:['document', 'image']
      };

      $scope.init(5);

    }]);

taggerControllers.controller('LayoutCtrl', ['$scope', 'Data', 'AreaList', function($scope, Data, AreaList) {

  $scope.areas = AreaList.query();
  Data.areas = $scope.areas;

}]);

// Injecting $rootScope so DialogController can
// broadcast event when new category is added.
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
    $scope.$watch(function(scope) { return scope.Data.categories },
      function(newValue, oldValue) {
        $scope.categories = newValue;
      }
    );

    $scope.$on('categoriesUpdate', function(event, data) {
      console.log(data);
      $scope.categories = data.categories;
      $scope.resetCategory(data.id);
    });

    $scope.$on('categoriesUpdateAfterDelete', function(event, data) {
      $scope.categories = data;
      $scope.resetCategory(data[0].id);
    });

    $scope.$on('categoryUpdate', function(event, data) {
      console.log(data);
      $scope.resetCategory(data);
    });

    // initializes page
    $scope.init = function() {

      $scope.categories = CategoryList.query();
      // retrieves first category
      $scope.categories
        .$promise
        .then(function(data) {

          $scope.Data.categories = data;
          Data.currentCategoryIndex = data[0].id;
          $scope.getCategory(data[0].id);

        });


    };


    $scope.resetCategory = function(id) {

      console.log('reset');
      $scope.category = Category.query({id: id});

    };


    // retrieves category by id
    $scope.getCategory = function(id) {

      Data.currentCategoryIndex = id;
      console.log('getcategory');
      $scope.category = Category.query({id: id});

    };



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

          toast("Category Updated");
        }
      })

    };

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
      '      Close Dialog' +
      '    </md-button>' +
      '    <md-button ng-click="addCategory(category.title)" class="md-primary">' +
      '      Add Category' +
      '    </md-button>' +
      '  </div>' +
      '</md-dialog>';

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
      '      Close Dialog' +
      '    </md-button>' +
      '    <md-button ng-click="deleteCategory(Data.currentCategoryIndex)" class="md-primary">' +
      '      Delete Category' +
      '    </md-button>' +
      '  </div>' +
      '</md-dialog>';

    $scope.showDialog = showDialog;
    // internal method
    function showDialog($event, message) {
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        parent: parentEl,
        targetEvent: $event,
        template: message,
        controller: DialogController
      });

      // this needs to be updated for category
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

        $scope.getCategoryListAndUpdate = function () {

          Data.categories  = CategoryList.query();
          Data.categories.$promise.then(function () {

            $scope.broadcastDelete();

          });

        };

        $scope.broadcastDelete = function() {

          $rootScope.$broadcast('categoriesUpdateAfterDelete', Data.categories);
          $rootScope.$broadcast('categoryUpdate', Data.categories[0].id);

        };

        $scope.closeDialog = function() {
          $mdDialog.hide();
        }

      }
    }

    $scope.areas = Data.areas;

    function toast(content) {

      // likely to be using this again. Needs to become a directive
      // or shared method.
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

