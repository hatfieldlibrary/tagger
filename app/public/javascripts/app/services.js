
'use strict';

var host = 'http://localhost:3000/rest/';
var adminhost = 'http://localhost:3000/admin/';
//var host = 'http://libmedia.willamette.edu/acomrest2/';
//var adminhost = 'http://localhost:3000/taggerAdmin/';
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

taggerServices.factory('AreaById', ['$resource',
  function( $resource) {
    return $resource(host + 'area/byId/:id', {}, {
        query: {method:'GET', isArray: false}
      });
  }
]);

taggerServices.factory('AreaAdd', ['$resource',
  function($resource) {
    return $resource(host + 'area/add');
  }
]);

taggerServices.factory('AreaDelete', ['$resource',
  function($resource) {
    return $resource(host + 'area/delete');
  }
]);

taggerServices.factory('AreaUpdate', ['$resource',
  function($resource) {
    return $resource(host + 'area/update');
  }
]);

taggerServices.factory('Category', ['$resource',
  function($resource) {
    return $resource(host + 'category/:id', {}, {
      query: {method:'GET', isArray: false}
    });
  }
]);

taggerServices.factory('CategoryList', ['$resource',
  function($resource) {
    return $resource(host + 'category/show/list', {}, {
      query: {method:'GET', isArray: true}
    });
  }
]);

taggerServices.factory('CategoryUpdate', ['$resource',
  function($resource) {
    return $resource(host + 'category/update');
  }
]);

taggerServices.factory('CategoryAdd', ['$resource',
  function($resource) {
    return $resource(host + 'category/add');
  }
]);

taggerServices.factory('CategoryDelete', ['$resource',
  function($resource) {
    return $resource(host + 'category/delete');
  }
]);
