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
