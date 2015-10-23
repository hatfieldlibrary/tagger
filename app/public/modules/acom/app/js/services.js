/**
 * Created by mspalti on 6/6/14.
 */

'use strict';

var host = 'http://localhost:3000/rest/';
//var host = 'http://libmedia.willamette.edu/acomrest2/';

var collectionServices = angular.module('collectionServices', ['ngResource']);

collectionServices.factory('CollectionById', ['$resource',
  function($resource){
    return $resource(host + 'collection/info/byId/:id', {}, {
      query: {method:'GET', isArray:false}
    });
  }
]);

collectionServices.factory('CollectionsByArea', ['$resource',
  function($resource){
    return $resource(host + 'collection/byArea/:id', {}, {
      query: {method:'GET', isArray:true}
    });
  }
]);

collectionServices.factory('CollectionBySubject', ['$resource',
  function($resource){
    return $resource(host + 'collection/bySubject/:id/area/:areaId', {}, {
      query: {method:'GET', isArray:true}
    });
  }
]);

collectionServices.factory('SubjectsByArea', ['$resource',
  function($resource){
    return $resource(host + 'subjects/byArea/:id', {}, {
      query: {method:'GET', isArray:true}
    });
  }
]);

collectionServices.factory('AreaList', ['$resource',
  function ($resource) {
    return $resource(host + 'areas', {}, {
      query: {method: 'GET', isArray: true}
    });
  }
]);

collectionServices.factory('AreaById', ['$resource',
  function($resource){
    return $resource(host + 'area/byId/:id', {}, {
      query: {method:'GET', isArray:false}
    });
  }
]);

collectionServices.factory('AllCollections', ['$resource',
  function($resource) {
    return $resource(host + 'collections/all', {}, {
      query: {method:'GET',isArray:true}
    });
  }
]);

collectionServices.factory('BrowseListRequest', ['$resource',
  function($resource) {
    return $resource(host + 'getBrowseList/collegian', {}, {
      query: {method:'GET', isArray: false }
    });}
]);

