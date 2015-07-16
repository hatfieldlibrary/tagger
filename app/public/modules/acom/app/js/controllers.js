'use strict';

var collectionControllers = angular.module('collectionControllers', []);

collectionControllers.controller('CollectionsHomeCtrl', ['$scope','$location', 'CollectionsByArea','CollectionBySubject','SubjectsByArea','AreaById',
  function($scope, $location, CollectionsByArea, CollectionsBySubject, SubjectsByArea, AreaById ) {

    $scope.init = function () {
      var path = $location.path();
      var components = path.split('/');
      var id = components[3];
      $scope.layout = 'full';
      $scope.tagged = true;
      $scope.getTagInfo(id);
      $scope.collection = CollectionByArea.query({id: id});
    };

    $scope.init();

  }]);

collectionControllers.controller('CollectionByIdCtrl', ['$scope','$location', 'CollectionLookup',
  function($scope, $location, CollectionLookup) {

    $scope.init = function () {
      var path = $location.path();
      var components = path.split('/');
      var id = components[3];
      $scope.layout = 'full';
      $scope.tagged = true;
      $scope.getTagInfo(id);
      $scope.collection = CollectionLookup.query({id: id});
    };

    $scope.init();

  }]);

collectionControllers.controller('TypeCollectionsCtrl', ['$scope', '$location', '$anchorScroll', 'CollectionsType','TypeInfo',
  function($scope, $location, $anchorScroll, CollectionsType, TypeInfo) {

    $scope.init = function () {

      var id;
      $scope.taglist = {};
      $scope.tagged = true;
      $scope.findingaid = false;
      $scope.collectionType = false;
      $scope.layout = 'full';
      $scope.toggleText = '(to list view)';
      var path = $location.path();
      var components = path.split('/');
      if (components.length < 4) {
        // unit test
        id = 5;
      } else {
        id = components[4];
      }
      $scope.activeIndex = 0;
      $scope.test = '';
      //TypeInfo.query({id: id})
      $scope.getTypeInfo(id);
      $scope.collections = CollectionsType.query({id: id});

    };

    $scope.toggleView = function() {
      if ($scope.layout === 'full') {
        $scope.layout = 'list';
        $scope.toggleText = '(to full view)';
      } else {
        $scope.layout = 'full';
        $scope.toggleText = '(to list view)';
      }
    };

    $scope.isFindingAid = function(type) {
      return type === 'ead';
    };

    $scope.isSingleItem = function(type) {
      if (type === 'itm') {
        return true;
      }
      return false;
    };

    $scope.goToTop = function (){
      $location.hash('top');
      // call $anchorScroll()
      $anchorScroll();
    };

    $scope.getTypeInfo = function(id) {
      $scope.typeInfo = TypeInfo.query({id: id});
    };

    $scope.isTagged = function() {
      return $scope.tagged;
    };

    $scope.setLimit = function() {
      if ($scope.letterLimit === 450) {
        $scope.letterLimit = 2500;
        $scope.limitText = 'View short description';
      } else {
        $scope.letterLimit = 450;
        $scope.limitText = 'View full description';
      }
    };

    $scope.$on('tagEvent', function(event, id, index) {

      // why is this here?  What is index for?
      if (index !== undefined) {
        $scope.activeIndex = index;
      }
      // for subject tag event on item type collections page,
      // change path to subject collections
      $scope.goToTop();
      $location.path('/collections/' + id);

    });

    $scope.$on('typeEvent', function(event, id, index) {

      $scope.goToTop();
      // why is this here?  What is index for?
      if (index !== undefined) {
        $scope.activeIndex = index;
      }
      $scope.tagged = true;
      $scope.getTypeInfo(id);
      $scope.collections = CollectionsType.query({id: id});
    });

    $scope.init();

  }]);

collectionControllers.controller('CollectionsCtrl', ['$scope', '$location', '$anchorScroll', 'Collections', 'DspaceCollections', 'TagInfo',
  function($scope, $location, $anchorScroll, Collections, DspaceCollections, TagInfo) {

    $scope.init = function () {
      var id;
      $scope.taglist = {};
      $scope.tagged = true;
      $scope.findingaid = false;
      $scope.collectionType = false;
      $scope.layout = 'full';
      $scope.toggleText = '(to list view)';
      $scope.activeIndex = 0;
      $scope.test = '';
      var path = $location.path();
      var components = path.split('/');
      if (components.length < 4) {
        // it's a unit test
        id = 5;
      } else {
        id = components[3];
      }
      $scope.getTagInfo(id);
      $scope.getCollections(id);

    };

    $scope.getCollections = function(id) {
      $scope.collections = Collections.query({id: id});
    };

    $scope.toggleView = function() {
      if ($scope.layout === 'full') {
        $scope.layout = 'list';
        $scope.toggleText = '(to full view)';
      } else {
        $scope.layout = 'full';
        $scope.toggleText = '(to list view)';
      }
    };

    $scope.setToFindingAid = function() {
      $scope.findingaid = true;
    };

    $scope.isFindingAid = function(type) {
      return type === 'ead';
    };

    $scope.resetFilter = function(type) {

      if (type === 'ead') {
        $scope.collectionType.dig = false;
      } else if (type === 'dig') {
        $scope.collectionType.ead = false;
      }
    };

    $scope.isSingleItem = function(type) {
      if (type === 'itm') {
        return true;
      }
      return false;
    };

    $scope.isAdminTypeTag = function (type) {
      return type === 'adm';
    };

    $scope.goToTop = function (){
      $location.hash('top');
      // call $anchorScroll()
      $anchorScroll();
    };


    $scope.plural = function(id) {
      if (id === 1) {
        return '';
      } else {
        return 's';
      }
    };

    $scope.getTypeLabel = function() {

      if ($scope.collectionType.dig === true) {
        return 'digital collection';
      } else if ($scope.collectionType.ead === true) {
        return 'finding aid';
      } else {
        return 'collection';
      }
    };

    $scope.getTagInfo = function(id) {
      $scope.tagInfo = TagInfo.query({id: id});
    };


    $scope.isTagged = function() {
      return $scope.tagged;
    };

    // test for digital collection type
    $scope.isCollection = function(type) {
      if (type === 'dig') {
        return true;
      }
      return false;
    };

    $scope.isStaticLink = function(link) {
      return link === 'link';
    };

    $scope.isBrowseList = function(link) {
      return link === 'list';
    };
    $scope.letterLimit = 600;
    $scope.limitText = 'View full description';
    // test for digital collection type
    $scope.isCollection = function(type) {
      if (type === 'dig') {
        return true;
      }
      return false;
    };

    $scope.setLimit = function() {

      if ($scope.letterLimit === 450) {
        $scope.letterLimit = 2500;
        $scope.limitText = 'View short description';
      } else {
        $scope.letterLimit = 450;
        $scope.limitText = 'View full description';
      }
    };

    $scope.$on('tagEvent', function(event, id, index) {

      $scope.goToTop();
      // why is this here?  What is index for?
      if (index !== undefined) {
        $scope.activeIndex = index;
      }
      // not a DSpace collection
      if (id !== 'comm') {
        $scope.tagged = true;
        $scope.getTagInfo(id);
        $scope.getCollections(id);
      } else {
        $scope.tagged = false;
        $scope.collections = DspaceCollections.query();
        $scope.tagInfo = {name:'Community Collections', url: 'http://dspace.willamette.edu'};
      }

    });

    $scope.init();

  }]);

collectionControllers.controller('TaggedCollectionCtrl', ['$scope', function($scope) {

  $scope.letterLimit = 450;
  $scope.limitText = 'View full description';
  // test for digital collection type
  $scope.isCollection = function(type) {
    if (type === 'dig') {
      return true;
    }
    return false;
  };

  $scope.isStaticLink = function(link) {
    return link === 'link';
  };

  $scope.isBrowseList = function(link) {
    return link === 'list';
  };

  $scope.setLimit = function() {
    if ($scope.letterLimit === 450) {
      $scope.letterLimit = 2500;
      $scope.limitText = 'View short description';
    } else {
      $scope.letterLimit = 450;
      $scope.limitText = 'View full description';
    }
  };
  $scope.updateItems = function(id, index) {

    $scope.$emit('tagEvent', id, index);
  };

  $scope.typesUpdate = function (id, index) {
    $scope.$emit('typeEvent', id, index);
  };


}]);


collectionControllers.controller('SubjectCtrl', ['$scope', '$location','Subjects', function($scope, $location, Subjects) {
  $scope.subjects = Subjects.query();
  $scope.Math = window.Math;
}]);

collectionControllers.controller('TypeCtrl', ['$scope', '$location','Types', function($scope, $location, Types) {
  $scope.types = Types.query();
  $scope.Math = window.Math;
}]);

collectionControllers.controller('EadCtrl', ['$scope', '$location', 'EADs', function($scope, $location, EADs) {

  var id;
  var field;
  var path =  $location.path();
  var components = path.split('/');

  if (components.length < 4) {
    // unit test
    id = 'political+papers';
    field = 'local';
  }  else {
    id =  components[2];
    field = components[3];
  }

  $scope.eads = EADs.query({id: id, fld: field});

  $scope.submit = function(query) {

    window.location.href = 'http://libmedia.willamette.edu/cview/'+query.area+'.html#!search:search:'+query.alias+'/all^'+encodeURIComponent(query.terms)+'^all^and!'+query.fields;
  };

}]);

collectionControllers.controller('EadRestRequest', ['$scope', '$location', 'EadRestRequest', function($scope, $location, EadRestRequest) {

  var path = $location.path();
  var components = path.split('/');
  var query = components[3];
  var field = components[4];

  $scope.eads = EadRestRequest.query({query: query, field: field});
}]);

collectionControllers.controller('SubPageCollectionsCtrl', ['$scope', '$location', 'SubCollections', function($scope, $location, SubCollections) {

  var id;
  var path =  $location.path();
  var components = path.split('/');
  if (components.length < 5) {
    // unit test
    id = 1;
  }  else {
    id =  components[4];
  }

  $scope.subCollections = SubCollections.query({id: id});

}]);

collectionControllers.controller('DspaceCollectionsCtrl', ['$scope', '$location', 'DspaceCollections', function($scope,$location, DspaceCollections) {

  $scope.init = function () {
    $scope.dspaceCollections = DspaceCollections.query();
  };

  $scope.init();

}]);

collectionControllers.controller('FilterCtrl', ['$scope', function($scope) {

  $scope.clickItem = function(clickEvent) {
    $scope.selected = clickEvent ;
  };

}]);

collectionControllers.controller('TagInfoCtrl', ['$scope', 'TagInfo', function($scope, TagInfo) {

  $scope.getTagInfo = function(id) {

    $scope.tagInfo = TagInfo.query({id: id});
  };
}]);

collectionControllers.controller('SearchFormCtrl', ['$scope', '$location', function($scope) {

  $scope.submit = function(query) {

    window.location.href = 'http://libmedia.willamette.edu/cview/'+query.area+'.html#!search:search:'+query.alias+'/all^'+encodeURIComponent(query.terms)+'^all^and!';
  };

}]);

collectionControllers.controller('ComplexFormCtrl', ['$scope', '$location', function($scope) {

  $scope.submit = function(query) {

    window.location.href = 'http://libmedia.willamette.edu/cview/'+query.area+'.html#!search:search:'+query.alias+'/all^'+encodeURIComponent(query.terms)+'^all^and!'+query.fields;
  };

}]);

collectionControllers.controller('AcomHomeSearchCtrl', ['$scope', '$location', function($scope) {

  $scope.collections = [
    {'repo': 'cdm',area: 'images', 'collection': 'art,hfmanw,theatre', label:'Art & Costume Images'},
    {'repo': 'cdm',area: 'hfma', 'collection': 'hfmanw,hfmoaevents', label:'Hallie Ford Museum'},
    {'repo': 'cdm',area: 'archives', 'collection': 'manuscripts,aphotos,glee,rare,eads,pnaa', label:'University Archives'},
    {'repo': 'dspace',area: 'all', 'collection': 'all', label:'WU Community Collections'}
  ];

  $scope.selectedCollection = $scope.collections[0];

  $scope.submitQuery = function(query) {
    var href = '';
    if ($scope.selectedCollection.repo === 'cdm') {
      href = 'http://libmedia.willamette.edu/cview/'+$scope.selectedCollection.area+'.html#!search:search:' + $scope.selectedCollection.collection + '/all^' + encodeURIComponent(query.terms) + '^all^and!';
      window.location.href = href;
    }
    else if ($scope.selectedCollection.repo === 'dspace') {
      var form = $('<form>').hide();
      form.attr('action','http://libmedia.willamette.edu/xmlui/discover');
      form.attr('method','POST');
      var input = $('<input type="hidden"/>');
      input.attr({'id': 'query',
        'name': 'query',
        'value': query.terms });
      form.append(input);
      form.submit();
    }
  };

}]);

collectionControllers.controller('QuickSearchHiddenFieldsCtrl', ['$scope', '$location', function($scope) {

  $scope.submitQuery = function(query) {

    var href = 'http://libmedia.willamette.edu/cview/'+query.area+'.html#!search:search:' + query.collections + '/all^' + encodeURIComponent(query.terms) + '^all^and!';
    window.location.href = href;
  };
}]);

collectionControllers.controller('SimpleSearchCtrl', ['$scope', '$location', function($scope) {

  $scope.submitQuery = function(query) {
    var href = $scope.url + 'all^' + encodeURIComponent(query.terms) + '^all^and!';
    window.location.href = href;
  };

}]);

collectionControllers.controller('ScopedSearchCtrl', ['$scope', function($scope) {

  $scope.init = function() {
    // var queryScope = $x;
    // var url = $scope.url;

  };

  $scope.submitQuery = function(query) {

    var queryScope =  'dicoll^' + encodeURIComponent($scope.queryScope) + '^all^and!';
    var field =  'all^' + encodeURIComponent(query.terms) + '^all^and!';
    var href = $scope.url + queryScope + field;
    window.location.href = href;
  };

}]);

collectionControllers.controller('BrowseListCtrl', ['$scope', 'BrowseListRequest', function($scope, BrowseListRequest) {
  $scope.collection = '';
  $scope.init = function() {

  };
  $scope.list = BrowseListRequest.query();

  $scope.submitQuery = function(query) {

    var href =  'http://libmedia.willamette.edu/cview/'+query.area+'.html#!browse:search:' + query.collections + '/all^' + query.terms.item.title + '^any^and!';
    window.location.href = href;
  };

}]);
