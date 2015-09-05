
'use strict';

var host = 'http://localhost:3000/rest/';
//var host = 'http://libmedia.willamette.edu/acomrest2/';

var taggerServices = angular.module('taggerServices', ['ngResource']);

taggerServices.factory('CollectionsByArea', ['$resource',
  function($resource){
    return $resource(host + 'collection/byArea/:id', {}, {
      query: {method:'GET', isArray:true}
    });
  }
]);

taggerServices.factory('CollectionById', ['$resource',
  function($resource) {
    return $resource(host + 'collection/byId/:id', {}, {
      query: {method:'GET', isArray: false}
    });
  }
]);

taggerServices.factory('TagsForCollection', ['$resource',
  function($resource) {
    return $resource(host + 'collection/tags/:id', {}, {
      query: {method:'GET', isArray: true}
    });
  }
]);

taggerServices.factory('TypesForCollection', ['$resource',
  function($resource) {
    return $resource(host + 'collection/types/:id', {}, {
      query: {method:'GET', isArray: true}
    });
  }
]);

taggerServices.factory('AreaList', ['$resource',
  function($resource) {
    return $resource(host + 'areas', {}, {
      query: {method:'GET', isArray: true}
    });
  }
]);
