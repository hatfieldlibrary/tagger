/**
 * Created by mspalti on 6/6/14.
 */

'use strict';

var collectionDirectives  = angular.module('collectionDirectives', []);

collectionDirectives.directive('collectionsView', function() {

  return {
    restrict: 'E',
    scope: {},
    controller: 'CollectionsCtrl',
    transclude: true,
    templateUrl: '/commons/components/collections.html'
  };
});

collectionDirectives.directive('collectionList', function() {

  return {
    restrict: 'E',
    scope: {
      title: '@',
      restricted: '=restricted',
      url: '@'
    },

    transclude: true,
    templateUrl: '/commons/components/collectionList.html'
  };
});

collectionDirectives.directive('collectionCard', function() {

  return {
    scope: {
      id: '@',
      title: '@',
      url: '@',
      restricted: '=restricted',
      description: '@'
    },
    restrict: 'E',
    transclude: false,
    templateUrl: '/commons/components/collectionCard.html'
  };
});

collectionDirectives.directive('areaBox', function() {
  return {
    scope: {
      id: '@',
      title: '@',
      description:'@',
      url: '@',
      searchUrl: '@',
      subjectId: '@',
      subjectName: '@'
    },
    restrict: 'E',
    transclude: false,
    controller: 'AcomHomeSearchCtrl',
    templateUrl: '/commons/components/areaBox.html'
  };
});


collectionDirectives.directive('subjectTags', function() {

  return {
    scope: {
      subjects: '=',
      collections: '=',
      areaId: '@',
      model: '='
    },
    restrict: 'E',
    transclude: true,
    controller: 'CollectionsHomeCtrl',
    templateUrl: '/commons/components/subjectTags.html'
  };
});

collectionDirectives.directive('taggedCollection', function() {

  return {
    scope: {
      name: '@',
      url: '@',
      browseType: '@',
      description: '@',
      image: '@',
      dates: '@',
      items: '@',
      collType: '@',
      itemTypes: '=',
      updateItems: '&',
      tags: '='
    },
    restrict: 'E',
    controller: 'TaggedCollectionCtrl',
    transclude: false,
    templateUrl: '/commons/components/modTaggedCollection.html'
  };
});

collectionDirectives.directive('tag', function() {

  return {
    restrict: 'E',
    scope: {
      name: '@',
      id: '@',
      updateItems: '&'
    },
    templateUrl: '/commons/components/tagButton.html'
  };
});

collectionDirectives.directive('findingaid', function() {

  return {
    scope: {
      name: '@',
      url: '@',
      dates: '@',
      description: '@',
      tags: '='
    },
    restrict: 'E',
    controller: 'TaggedCollectionCtrl',
    transclude: false,
    templateUrl: '/commons/components/modFindingAid.html'
  };
});

collectionDirectives.directive('simpleLink', function() {
  return {
    scope: {
      name: '@',
      url: '@'
    },
    restrict: 'E',
    transclude: false,
    templateUrl: '/commons/components/simpleLink.html'
  };
});

collectionDirectives.directive('simpleTaggedCollection', function() {

  return {
    scope: {
      name: '@',
      url: '@',
      description: '@',
      dates: '@',
      items: '@',
      ctypes: '=',
      updateItems: '&'
    },
    restrict: 'E',
    transclude: true,
    templateUrl: '/commons/components/simpleTaggedCollection.html'
  };
});




collectionDirectives.directive('unTaggedCollection', function() {

  return {
    scope: {
      name: '@',
      url: '@'
    },
    restrict: 'E',
    templateUrl: '/commons/components/unTaggedCollection.html'
  };
});

collectionDirectives.directive('searchForm', function() {

  return {
    scope: {
      name: '@',
      queryScope: '@',
      url: '@'
    },
    controller: 'ScopedSearchCtrl',
    restrict: 'E',
    templateUrl: '/commons/components/searchForm.html'
  };
});

collectionDirectives.directive('searchFormSimple', function() {

  return {
    scope: {
      name: '@',
      url: '@'
    },
    controller: 'SimpleSearchCtrl',
    restrict: 'E',
    templateUrl: '/commons/components/searchFormSimple.html'

  };
});

/**
 *	Angular directive to truncate multi-line text to visible height
 *
 *	@param bind (angular bound value to append) REQUIRED
 *	@param ellipsisAppend (string) string to append at end of truncated text after ellipsis, can be HTML OPTIONAL
 *	@param ellipsisSymbol (string) string to use as ellipsis, replaces default '...' OPTIONAL
 *	@param ellipsisAppendClick (function) function to call if ellipsisAppend is clicked (ellipsisAppend must be clicked) OPTIONAL
 *
 *	@example <p data-ellipsis data-ng-bind="boundData"></p>
 *	@example <p data-ellipsis data-ng-bind="boundData" data-ellipsis-symbol="---"></p>
 *	@example <p data-ellipsis data-ng-bind="boundData" data-ellipsis-append="read more"></p>
 *	@example <p data-ellipsis data-ng-bind="boundData" data-ellipsis-append="read more" data-ellipsis-append-click="displayFull()"></p>
 *
 */


collectionDirectives.directive('ellipsis', ['$timeout', '$window', function($timeout, $window) {
  /*jshint unused:false*/
  return {
    restrict	: 'A',
    scope		: {
      ngBind				: '=',
      ellipsisAppend		: '@',
      ellipsisAppendClick	: '&',
      ellipsisSymbol		: '@'
    },
    compile : function(elem, attr, linker) {

      return function(scope, element, attributes) {
        /* Window Resize Variables */
        attributes.lastWindowResizeTime = 0;
        attributes.lastWindowResizeWidth = 0;
        attributes.lastWindowResizeHeight = 0;
        attributes.lastWindowTimeoutEvent = null;
        /* State Variables */
        attributes.isTruncated = false;


        function buildEllipsis() {
          if (scope.ngBind) {
            var bindArray = scope.ngBind.split(' '),
              i = 0,
              ellipsisSymbol = (typeof(attributes.ellipsisSymbol) !== 'undefined') ? attributes.ellipsisSymbol : '&hellip;',
              appendString = (typeof(scope.ellipsisAppend) !== 'undefined' && scope.ellipsisAppend !== '') ? ellipsisSymbol + '<span>' + scope.ellipsisAppend + '</span>' : ellipsisSymbol;

            attributes.isTruncated = false;
            element.text(scope.ngBind);

            // If text has overflow
            if (isOverflowed(element)) {
              var bindArrayStartingLength = bindArray.length,
                initialMaxHeight = element[0].clientHeight;

              element.text(scope.ngBind).html(element.html() + appendString);

              // Set complete text and remove one word at a time, until there is no overflow
              for ( ; i < bindArrayStartingLength; i++) {
                bindArray.pop();
                element.text(bindArray.join(' ')).html(element.html() + appendString);

                if (element[0].scrollHeight < initialMaxHeight || isOverflowed(element) === false) {
                  attributes.isTruncated = true;
                  break;
                }
              }

              // If append string was passed and append click function included
              if (ellipsisSymbol !== appendString && typeof(scope.ellipsisAppendClick) !== 'undefined' && scope.ellipsisAppendClick !== '' ) {
                element.find('span').bind('click', function (e) {
                  scope.$apply(scope.ellipsisAppendClick);
                });
              }
            }
          }
        }

        /**
         *	Test if element has overflow of text beyond height or max-height
         *
         *	@param element (DOM object)
         *
         *	@return bool
         *
         */
        function isOverflowed(thisElement) {
          return thisElement[0].scrollHeight > thisElement[0].clientHeight;
        }

        /**
         *	Watchers
         */

        /**
         *	Execute ellipsis truncate on ngBind update
         */
        scope.$watch('ngBind', function () {
          $timeout(function() {
            buildEllipsis();
          });
        });

        /**
         *	Execute ellipsis truncate on ngBind update
         */
        scope.$watch('ellipsisAppend', function () {
          buildEllipsis();
        });

        /**
         *	When window width or height changes - re-init truncation
         */

        function onResize() {
          $timeout.cancel(attributes.lastWindowTimeoutEvent);

          attributes.lastWindowTimeoutEvent = $timeout(function() {
            if (attributes.lastWindowResizeWidth !== window.innerWidth || attributes.lastWindowResizeHeight !== window.innerHeight) {
              buildEllipsis();
            }

            attributes.lastWindowResizeWidth = window.innerWidth;
            attributes.lastWindowResizeHeight = window.innerHeight;
          }, 75);
        }

        var $win = angular.element($window);
        $win.bind('resize', onResize);

        /**
         * Clean up after ourselves
         */
        scope.$on('$destroy', function() {
          $win.unbind('resize', onResize);
        });


      };
    }
  };
}]);
