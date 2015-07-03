/**
 * Created by mspalti on 6/6/14.
 */

'use strict';

//var host = 'http://127.0.0.1:3000/rest/';
var host = 'http://libmedia.willamette.edu/acomrest/';

var collectionServices = angular.module('collectionServices', ['ngResource']);


collectionServices.factory('Collections', ['$resource',
    function($resource){
        return $resource(host + 'collection/bytag/:id', {}, {
            query: {method:'GET', isArray:true}
        });
    }
]);

collectionServices.factory('CollectionsType', ['$resource',
    function($resource){
        return $resource(host + 'collection/bytype/:id', {}, {
            query: {method:'GET', isArray:true}
        });
    }
]);

collectionServices.factory('SubCollections', ['$resource',
    function($resource){
        return $resource(host + 'collection/bytag/:id', {}, {
            query: {method:'GET', isArray:true}
        });
    }
]);

collectionServices.factory('CollectionLookup', ['$resource',
    function($resource) {
        return $resource(host + 'collection/byId/:id', {}, {
            query: {method:'GET', isArray:false}
        });
    }
]);

collectionServices.factory('Subjects',['$resource',
    function($resource) {
        return $resource(host + 'subjects', {}, {
            query: {method: 'GET', isArray:true}
        });
    }
]);

collectionServices.factory('Types',['$resource',
    function($resource) {
        return $resource(host + 'types', {}, {
            query: {method: 'GET', isArray:true}
        });
    }
]);

collectionServices.factory('DspaceCollections', ['$resource',
    function($resource) {
        return $resource(host + 'getDspaceCollections', {}, {
            query: {method: 'GET', isArray: true}
        });
    }
]);

collectionServices.factory('TagInfo', ['$resource',
    function($resource) {
        return $resource(host + 'tag/getInfo/:id', {}, {
            query: {method: 'GET', isArray: false}
        });
    }
]);

collectionServices.factory('TypeInfo', ['$resource',
    function($resource) {
        return $resource(host + 'type/getInfo/:id', {}, {
            query: {method: 'GET', isArray: false}
        });
    }
]);

// Direct query of CDM API via NodeJS tagger application
collectionServices.factory('EADs', ['$resource',
    function($resource){
        return $resource(host + 'getEad/:id/:fld', {}, {
            query: {method:'GET', isArray:true}
        });
    }
]);
// Using servlet and the GWT CONTENTdm query service. This consolidates queries, so may be easiest to maintain.
collectionServices.factory('EadRestRequest', ['$resource',
    function($resource) {
        return $resource(host + 'search', { collection:'eads', repo:'cdm' ,field:'@local', query:'@query'}, {
            query: {method:'GET', isArray: false }
        });
    }
]);

collectionServices.factory('BrowseListRequest', ['$resource',
    function($resource) {
        return $resource(host + 'getBrowseList/collegian', {}, {
            query: {method:'GET', isArray: false }
        });}
]);

