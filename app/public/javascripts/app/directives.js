'use strict';

var taggerDirectives  = angular.module('taggerDirectives', []);

/**
 * This comparison function looks for inequality in
 * the inputs and returns true if found.  The input
 * values can be arrays or objects.  If the inputs are
 * two arrays of equal length, the objects within the two
 * arrays are compared.
 * @param newValue first array or object.
 * @param oldValue  second array or object.
 * @returns {boolean}  true if the two inputs are NOT equal.
 */
function checkForNewValues(newValue, oldValue) {

  var oldValueIsArray = (oldValue instanceof Array);
  var newValueIsArray = (newValue instanceof Array);

  // If the newValue is null, return false and do no further
  // comparison.
  if (newValue === null) {
    return false;
  }

  // New value is an array.
  if ( newValueIsArray) {

    // But the old value is not an array.
    if (!oldValueIsArray) {

      // The oldValue is null, so return inequality.
      if (oldValue === null) {
        return true;
      }
      // This should be unreachable, but if it is reached, log it.
      console.log("Something is amiss in the comparison for d3 pie charts");
    }

    // The oldValue is an array, but the two array lengths are not equal.
    if (newValue.length !== oldValue.length) {

      // The array lengths do not match, so return inequality.
      return true;

    } else {
      // Two arrays of equal length. Evaluate the array of objects.
      // Return return inequality if anything does not match.
      for (var i = 0; i < newValue.length; i++) {
        if (newValue[i].title !== oldValue[i].title
          || newValue[i].value !== oldValue[i].value) {
          return true;
        }
      }
    }

  // The newValue is an object, not an array.
  } else {
    // But the oldValue is an array, so return inequality.
    if (oldValueIsArray) { return true;}
    // Otherwise, compare the contents of two objects and return inequality
    // if they do not match.
    return (newValue.title !== oldValue.title
                  && newValue.value !== oldValue.value);

  }

}


/**
 * Directive used to detect when a DOM element is ready.
 */
taggerDirectives.directive('elemReady', function( $parse ) {
  return {
    restrict: 'A',
    scope: false,
    link: function( $scope, elem, attrs ) {
      elem.ready(function(){
        $scope.$apply(function(){
          var func = $parse(attrs.elemReady);
          func($scope);
        })
      })
    }
  }

});

/**
 * Directive used by the Collection Manager function of
 * adding or removing subject tags from the area that
 * the manager maintains.
 */
taggerDirectives.directive('toggleTagAreaButton', [

  'TaggerToast',
  'TagTargets',
  'TagTargetRemove',
  'TagTargetAdd',
  'Data',

  function(
    TaggerToast,
    TagTargets,
    TagTargetRemove,
    TagTargetAdd,
    Data ) {

    return {
      restrict: 'E',
      scope: {
        tagId: '@',
        tagName: '@'
      },
      template:
      '<div style="width: 10%;float:left;">' +
      '   <md-button class="{{buttonClass}} md-raised md-fab md-mini"  ng-click="update();">' +
      '     <i class="material-icons">{{buttonIcon}}</i>' +
      '     <div class="md-ripple-container"></div>' +
      '   </md-button>' +
      '</div>' +
      '<div style="width: 90%;float:left;line-height: 3.3rem;" class="{{textClass}} md-subhead">' +
      '   {{tagName}}' +
      '</div>' ,
      link: function(scope, elem, attrs) {

        var targetList = [];
        scope.buttonClass = '';

        scope.init = function() {
          var targets = TagTargets.query({tagId: scope.tagId});
          targets.$promise.then(function(data) {
            targetList = data;
            scope.checkArea();
          });
        };

        scope.init();

        scope.update = function() {

          if (targetList !== undefined) {

            // If the area id is a already associated with tag,
            // remove that association
            if (findArea(Data.currentAreaIndex, targetList)) {

              var result = TagTargetRemove.query(
                {
                  tagId: scope.tagId,
                  areaId: Data.currentAreaIndex
                }
              );
              result.$promise.then(function (data) {
                scope.init();
                if (data.status == 'success') {
                  targetList = result.areaTargets;
                  TaggerToast('Tag removed from area.')
                }
              });
            }
            // If the area id is a not associated with tag,
            // remove that association
            else {

              var result = TagTargetAdd.query(
                {
                  tagId: scope.tagId,
                  areaId: Data.currentAreaIndex
                }
              );
              result.$promise.then(function (data) {
                scope.init();
                if (data.status == 'success') {
                  targetList = result.areaTargets;
                  TaggerToast('Tag added to Area.')
                }
              });
            }
          }

        };

        scope.checkArea = function () {

          if(findArea(Data.currentAreaIndex, targetList)) {
            scope.buttonClass = 'md-warn';
            scope.buttonIcon = 'clear';
            scope.textClass = 'grey-label';
          } else {
            scope.textClass = 'grey-item';
            scope.buttonClass = 'md-accent';
            scope.buttonIcon = 'add';
          }
        }
      }
    }

  }

]);

taggerDirectives.directive('d3Bar', [

  '$window',
  '$timeout',
  'd3Service',

  function($window, $timeout, d3Service) {
    return {
      restrict: 'A',
      template: '',
      // creating scope object isolates
      scope: {
        data: '='      // bi-directional binding of data

      },
      // Angular link function
      link: function (scope, ele, attrs) {

        var margin,
          width,
          height,
          container,
          svg,
          xAxis,
          yAxis,
          x,
          y;


        // initialize on data change
        scope.$watch(function(scope) { return scope.data },
          function(newValue) {

            if (newValue !== undefined) {
              if (newValue.length > 0) {
                scope.data;
                ele.ready(function () {
                  prepareContainer();
                  setDimens();
                });
              } else {
                prepareContainer();
              }
            }
          });

        var containerEl = document.getElementById(attrs.id);

        /**
         * Clear the chart.  This will be called when an empty
         * data array is passed to the directive.
         */
        function  prepareContainer(){
          if (svg !== undefined) {
            svg = container.select('svg');
            svg.selectAll('g').remove();
            svg.select('circle').remove();
            containerEl.innerHTML = '';
          }
        }

        console.log(scope);


        var setDimens = function()  {


          margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = containerEl.offsetWidth - margin.left - margin.right,
            height = containerEl.offsetHeight - margin.top - margin.bottom;


          console.log(height);
          x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

          y = d3.scale.linear()
            .range([height, 0]);

          xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

          /**
           * The top level d3 node.
           * @type {Object}
           */
          container = d3.select(containerEl);


          svg = container.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          drawBarChart(scope.data);
        };



        // d3.tsv("data.tsv", type, function(error, data) {
        //   if (error) throw error;
        var drawBarChart = function(data) {

          yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10)
            .tickFormat(d3.format("d"))
            .tickSubdivide(0);

          x.domain(data.map(function(d) { return d.name; }));
          y.domain([0, d3.max(data, function(d) { return d.count; })]);

          svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

          svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Frequency");

          svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.name); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.count); })
            .attr("height", function(d) { return height - y(d.count); });
        };

        // });

        function type(d) {
          d.frequency = +d.frequency;
          return d;
        }
      }
    }
  }
]);

/**
 * Pie chart directive.
 */
taggerDirectives.directive('d3Pie', [
  '$window',
  '$timeout',
  'd3Service',
  function($window, $timeout, d3Service) {

    return {
      // attribute only
      restrict: 'A',
      template: '<svg id="{{label}}" style="overflow: visible;"> ' +
      '           <defs> ' +
      '             <filter id=\'pieChartInsetShadow\'> ' +
      '              <feOffset dx=\'0\' dy=\'0\'/> ' +
      '                 <feGaussianBlur stdDeviation=\'3\' result=\'offset-blur\' /> ' +
      '                 <feComposite operator=\'out\' in=\'SourceGraphic\' in2=\'offset-blur\' result=\'inverse\' /> ' +
      '                 <feFlood flood-color=\'black\' flood-opacity=\'1\' result=\'color\' />  ' +
      '                 <feComposite operator=\'in\' in=\'color\' in2=\'inverse\' result=\'shadow\' /> ' +
      '                 <feComposite operator=\'over\' in=\'shadow\' in2=\'SourceGraphic\' />  ' +
      '             </filter> ' +
      '             <filter id="pieChartDropShadow"> ' +
      '               <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" /> ' +
      '                 <feOffset in="blur" dx="0" dy="3" result="offsetBlur" /> ' +
      '                 <feMerge> <feMergeNode /> ' +
      '                 <feMergeNode in="SourceGraphic" /> </feMerge> ' +
      '             </filter> ' +
      '           </defs> ' +
      '         </svg>' +
      '         <div class="chart-data"></div>',
      // creating scope object isolates
      scope: {
        data: '=',      // bi-directional binding of data
        label: '@'
      },
      // Angular link function
      link: function (scope, ele, attrs) {

        var data = [];
        var DURATION = 800;
        var DELAY    = 200;

        /**
         * Array of colors used by class attributes.
         * @type {Array<string> }*/
        var colors = ['seagreen', 'blue', 'skyblue', 'red', 'indigo', 'yellow', 'orange', 'green', 'maroon', 'coffee'];
        /**
         * The parent element
         * @type {Element}
         */
        var containerEl = document.getElementById(attrs.id),
          /**
           * The top level d3 node.
           * @type {Object}
           */
          container = d3.select(containerEl),
          labelsEl = container.select('.chart-data');

        /**
         * Calculates percentage from integer counts
         * @param values   count by type
         * @param total     count of all types
         * @returns {Array}
         */
        function ratios(values, total) {

          var data = [];
          for (var i = 0; i < values.length; i++) {
            data[i] = {
              title: values[i].title,
              value:  values[i].value / total,
              count: values[i].value}
          }

          return data;
        }

        /**
         * Return the color name from the colors array.
         * @param i  the index of the array element
         * @returns {string}
         */
        function colorWheel(i) {
          return colors[i];
        }



        // waiting for the d3 object promise
        d3Service.d3().then(function (d3) {

          var total = 0;

          // initialize on data change
          scope.$watch(function(scope) { return scope.data },
            function(newValue, oldValue) {
              if (newValue !== oldValue) {
                if (newValue !== undefined && oldValue !== undefined) {
                  console.log(newValue.data);
                  console.log(scope);
                  if (newValue.data !== undefined) {
                    if (checkForNewValues(newValue.data, oldValue.data)) {
                      if (newValue.data.length > 0) {
                        total = newValue.total;
                        // calculate percentages
                        data = ratios(newValue.data, total);
                        // Make sure element is ready
                        ele.ready(function () {
                          clearChart();
                          drawPieChart();
                        });
                      } else {
                        clearChart();
                      }
                    }
                  }
                }
              }
            });


          // d3 code begins here.

          /**
           * Clear the chart.  This will be called when an empty
           * data array is passed to the directive.
           */
          function clearChart() {

            var  svg = container.select('svg');
            svg.selectAll('g').remove();
            svg.select('circle').remove();
            labelsEl.selectAll('.item-info').remove();
          }



          /**
           * Draws the pie chart
           */
          function drawPieChart() {

            var width = containerEl.clientWidth / 2,
              height = width * 0.7,
              radius = Math.min(width, height) / 2,
              svg = container.select('svg')
                .attr('width', width)
                .attr('height', height);

            var pie = svg.append('g')
              .attr(
              'transform',
              'translate(' + width / 2 + ',' + height / 2 + ')'
            );

            var detailedInfo = svg.append('g')
              .attr('class', 'pieChart--detailedInformation');

            var twoPi = 2 * Math.PI;
            var pieData = d3.layout.pie()
              .value(function (d) {
                return d.value;
              });

            var arc = d3.svg.arc()
              .outerRadius(radius - 10)
              .innerRadius(0);


            var pieChartPieces = pie.datum(data)
              .selectAll('path')
              .data(pieData)
              .enter()
              .append('path')
              .attr('class', function (d, i) {
                return 'pieChart__' + colorWheel(i);
              })
              .attr('filter', 'url(#pieChartInsetShadow)')
              .attr('d', arc)
              .each(function () {
                this._current = {
                  startAngle: 0,
                  endAngle: 0
                };
              })
              .transition()
              .duration(DURATION)
              .attrTween('d', function (d) {
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);

                return function (t) {
                  return arc(interpolate(t));
                };
              })
              .each('end', function handleAnimationEnd(d) {
                drawDetailedInformation(d.data, labelsEl);
              });

            drawChartCenter();

            function drawChartCenter() {
              var centerContainer = pie.append('g')
                .attr('class', 'pieChart--center');

              centerContainer.append('circle')
                .attr('class', 'pieChart--center--outerCircle')
                .attr('r', 0)
                .attr('filter', 'url(#pieChartDropShadow)')
                .transition()
                .duration(DURATION)
                .delay(DELAY)
                .attr('r', radius - 52);

              centerContainer.append('circle')
                .attr('id', 'pieChart-clippy')
                .attr('class', 'pieChart--center--innerCircle')
                .attr('r', 0)
                .transition()
                .delay(DELAY)
                .duration(DURATION)
                .attr('r', radius - 65)
                .attr('fill', '#fff');
            }

            /**
             * This counter variable provides the index
             * used to request colors.
             * @type {number}
             */
            var currentColor = 0;

            /**
             * Adds color key, title, and count information for a single item to the DOM.
             * @param @type {Object} the item information
             * @param element the parent element
             */
            function drawDetailedInformation(data, element) {

              var listItem = element.append('div').attr('class','item-info');
              if (data.title === null) {
                data.title = '<span style="color: red;">No value selected</span>';
              }
              listItem.data([data])
                .html(
                '       <div style="float:left;width: 10%;" class="pieChart__' + colorWheel(currentColor) + '">' +
                '          <i class="material-icons">brightness_1</i>' +
                '       </div>' +
                '       <div style="float:left; width:75%;padding-left: 20px;color: #999;">' +
                data.title + ' (' + data.count + ')' +
                '       </div>' +
                '       <div style="clear:left;"></div>');
              currentColor++;

            }
          }
        });
      }
    };

  }]);


/**
 * Private method. Searches for area id in the current list of
 * area associations.
 * @param areaId  {number} the area ID
 * @param tar  {Array.<Object>} the areas associated with the collection.
 * @returns {boolean}
 */
var findArea = function(areaId, tar) {
  var targets = tar;
  for (var i = 0; i < targets.length; i++) {
    if (targets[i].AreaId === areaId) {
      return true;
    }
  }
  return false;
};

/**
 * Directive for selecting the areas with which a TAG will be associated.
 */
taggerDirectives.directive('tagAreaSelector', [function() {
  return {
    restrict: 'E',
    scope: {},
    template:
    '<md-card>' +
    '  <md-toolbar class="md-primary">' +
    '   <div class="md-toolbar-tools">' +
    '     <i class="material-icons"> public </i>' +
    '     <h3 class="md-display-1"> &nbsp;Areas</h3>' +
    '    </div>' +
    '   </md-toolbar>' +
    '   <md-card-content>' +
    '      <div layout="column" class="md-subhead">Select the Areas in which this Tag will appear.' +
    '        <md-container>' +
    '           <md-checkbox ng-repeat="area in areas" aria-label="Areas" value="area.id" ng-checked=isChosen(area.id) ng-click="update(area.id)">{{area.title}}</md-checkbox>' +
    '        </md=container>' +
    '      </div>' +
    '   </md-content>' +
    '</md-card>',
    controller: function (

      $scope,
      TagTargets,
      TagTargetRemove,
      TagTargetAdd,
      TaggerToast,
      Data) {


      /** @type {Array.<Object>} */
      $scope.areas = Data.areas;

      /** @type {Array.<Object>} */
      $scope.areaTargets = [];

      /**
       * Retrieve the areas for the current tag.
       * @param id the id of the tag
       */
      $scope.getCurrentAreaTargets = function (id) {
        $scope.areaTargets = TagTargets.query({tagId: id});

      };

      /**
       * Test whether an area is in the list of areas selected
       * for this tag.  Uses the areaTargets array for the
       * test.
       * @param areaId the area id
       */
      $scope.isChosen = function (areaId) {
        return findArea(areaId, $scope.areaTargets);

      };

      /**
       * Update by associating adding or removing the association of
       * a tag with the provided content area.
       * @param areaId id of the area to be added or removed
       */
      $scope.update = function (areaId) {

        if ($scope.areaTargets !== undefined) {

          // If the area id is a already associated with tag,
          // remove that association
          if (findArea(areaId, $scope.areaTargets)) {

            var result = TagTargetRemove.query(
              {
                tagId: Data.currentTagIndex,
                areaId: areaId
              }
            );
            result.$promise.then(function (data) {
              if (data.status == 'success') {
                $scope.areaTargets = result.areaTargets;
                TaggerToast('Tag removed from area.')
              }
            });
          }
          // If the area id is a not associated with tag,
          // remove that association
          else {

            var result = TagTargetAdd.query(
              {
                tagId: Data.currentTagIndex,
                areaId: areaId
              }
            );
            result.$promise.then(function (data) {
              if (data.status == 'success') {
                $scope.areaTargets = result.areaTargets;
                TaggerToast('Tag added to Area.')
              }
            });
          }
        }

      };

      /**
       * Watch updates the current list of area targets
       * when the current tag id changes.
       */
      $scope.$watch(function () {
          return Data.currentTagIndex
        },
        function (newValue) {
          if (newValue !== null) {
            $scope.getCurrentAreaTargets(newValue);
          }
        }
      );

      /**
       * Watches the global list of areas and updates local
       * area list on change.
       */
      $scope.$watch(function () {
          return Data.areas
        },
        function (newValue) {
          $scope.areas = newValue;
        });

    }
  }

}]);

/**
 * Directive for selecting the areas with which a COLLECTION will be associated.
 */
taggerDirectives.directive('areaSelector', [function() {
  return {
    restrict: 'E',
    scope: {},
    template:
    '<md-card>' +
    '  <md-toolbar class="md-primary">' +
    '   <div class="md-toolbar-tools">' +
    '     <i class="material-icons"> public </i>' +
    '     <h3 class="md-display-1"> &nbsp;Areas</h3>' +
    '    </div>' +
    '   </md-toolbar>' +
    '   <md-card-content>' +
    '      <div layout="column" class="md-subhead">Select the Areas in which this Collection will appear.' +
    '        <md-container>' +
    '           <md-checkbox ng-repeat="area in areas" aria-label="Areas" value="area.id" ng-checked=isChosen(area.id) ng-click="update(area.id)">{{area.title}}</md-checkbox>' +
    '        </md=container>' +
    '      </div>' +
    '   </md-content>' +
    '</md-card>',
    controller: function(

      $rootScope,
      $scope,
      AreasForCollection,
      AreaTargetRemove,
      AreaTargetAdd,
      TaggerToast,
      Data
    ) {

      /** @type {Array.<Object>} */
      $scope.areas = Data.areas;

      /** @type {Array.<Object>} */
      $scope.areaTargets = [];



      /**
       * Gets the list of areas associated with the current
       * collection
       * @param id  {number} the collection id
       */
      $scope.getCurrentAreaTargets = function (id) {
        $scope.areaTargets = AreasForCollection.query({collId: id});

      };

      /**
       * Tests to see if the collection area is currently
       * associated with this collection.
       * @param areaId   {number} area ID
       * @returns {boolean}
       */
      $scope.isChosen = function (areaId) {
        return findArea(areaId, $scope.areaTargets);

      };

      /**
       * Adds or removes the association between a collection and a
       * collection area.  If the association already exists, it is
       * removed.  If it is a new association, it is added. Toasts
       * on success.
       * @param areaId  {number} the area ID
       */
      $scope.update = function (areaId) {

        if ($scope.areaTargets !== undefined) {
          // If the area id of the selected checkbox is a
          // already a target, then delete the area target.
          if (findArea(areaId, $scope.areaTargets)) {
            if ($scope.areaTargets.length === 1) {
              TaggerToast('Cannot remove area.  Collections must belong to at least one area.');

            } else {
              var result = AreaTargetRemove.query({collId: Data.currentCollectionIndex, areaId: areaId});
              result.$promise.then(function (data) {
                if (data.status == 'success') {
                  $scope.areaTargets = result.areaTargets;
                  $rootScope.$broadcast('removedFromArea');
                  TaggerToast('Collection removed from area.')
                }
              });
            }
          }
          // If the area id of the selected item is
          // not a target already, add a new area target.
          else {
            var result = AreaTargetAdd.query({collId: Data.currentCollectionIndex, areaId: areaId});
            result.$promise.then(function (data) {
              if (data.status == 'success') {
                $scope.areaTargets = result.areaTargets;
                TaggerToast('Collection added to Area.')
              }
            });
          }
        }

      };

      /**
       * Watches for change in the collection index and retrieves areas
       * associated with the new collection.
       */
      $scope.$watch(function () {
          return Data.currentCollectionIndex
        },
        function (newValue) {
          if (newValue !== null) {
            $scope.getCurrentAreaTargets(newValue);
          }
        }
      );

      /**
       * Watch for change in the list of collection areas. Update
       * view model.
       */
      $scope.$watch(function () {
          return Data.areas
        },
        function (newValue) {
          $scope.areas = newValue;
        }
      );


    }

  }

}]);


/**
 * Directive used to associate a CONTENT TYPE with a COLLECTION.
 */
taggerDirectives.directive('contentTypeSelector', [ function() {

  return {
    restrict: 'E',
    scope: {},
    transclude: true,
    template:
    '<md-card flex>' +
    ' <md-toolbar class="md_primary">' +
    '   <div class="md-toolbar-tools">' +
    '     <i class="material-icons">local_movies</i>' +
    '     <h3 class="md-display-1">&nbsp;Content Types</h3>' +
    '     <span flex></span>' +
    '   </div>' +
    ' </md-toolbar>' +
    ' <md-card-content>' +
    '    <div layout="column">' +
    '       <md-input-container>' +
    '         <div layout="column" class="chips">' +
    '           <md-container>' +
    '             <label>Add Type</label>' +
    '             <md-chips ng-model="typesForCollection" md-autocomplete-snap="" md-require-match="true" md-on-append="addType($chip)" md-on-remove="removeType($chip)">' +
    '               <md-autocomplete md-selected-item="selectedItem" md-min-length="1" md-search-text="searchText" md-no-cache="true" md-items="item in queryTypes(searchText)" md-item-text="item.tag">' +
    '                 <span md-highlight-text="searchText"> {{item.name}} </span>' +
    '               </md-autocomplete>' +
    '               <md-chip-template>' +
    '                 <span> {{$chip.name}} </span>' +
    '               </md-chip-template>' +
    '               <button md-chip-remove="" class="md-primary taggerchip">' +
    '                 <md-icon md-svg-icon="md-close"></md-icon>' +
    '            </md-container>' +
    '         </div>' +
    '       </md-input-container>' +
    '     </div>' +
    ' </md-card-content>' +
    '</md-card>',

    controller: function(

      $scope,
      ContentTypeList,
      TypesForCollection,
      CollectionTypeTargetRemove,
      CollectionTypeTargetAdd,
      TaggerToast,
      Data ) {


      /** @type {queryTypes} */
      $scope.queryTypes = queryTypes;

      /** {Object} */
      $scope.selectedItem = null;

      /** {string} */
      $scope.searchText = null;

      /** {boolean} */
      $scope.isDisabled = false;

      /** @type {Array.<Object>} */
      $scope.selectedTags = [];

      /** @type {Array.<Object>} */
      $scope.globalTypes = ContentTypeList.query();

      /** @type {Array.<Object>} */
      $scope.typesForCollection = [];


      /**
       * Function called when adding a content type chip.  The
       * function associates the content type with this
       * collection via db call. Toasts on success.
       * @param chip {Object} $chip
       * @returns {{id: *, name: *}}
       */
      $scope.addType = function (chip) {

        var chipObj = {id: chip.id, name: chip.name};

        var result = CollectionTypeTargetAdd.query(
          {
            collId: Data.currentCollectionIndex,
            typeId: chip.id
          }
        );
        result.$promise.then(function (data) {
          if (data.status == 'success') {
            TaggerToast('Subject Tag Added');

          } else {
            TaggerToast('WARNING: Unable to add subject tag!');

          }
        });

        return chipObj;

      };

      /**
       * Function called when deleting a content type chip.  The
       * function removes the content type association with this
       * collection via db call. Toasts on success.
       * @param chip {Object} $chip
       */
      $scope.removeType = function (chip) {
        var result = CollectionTypeTargetRemove.query(
          {
            collId: Data.currentCollectionIndex,
            typeId: chip.id
          }
        );

        result.$promise.then(function (data) {
          if (data.status == 'success') {
            TaggerToast('Subject Tag Removed');
          } else {
            TaggerToast('WARNING: Unable to remove subject tag!');
          }
        });
      };


      /**
       * Watch for changes to the list of content t
       */
      $scope.$watch(function () {
          return Data.typesForCollection
        },
        function (newValue) {
          if (newValue.length > 0) {
            var objArray = [];
            for (var i = 0; i < newValue.length; i++) {
              objArray[i] = {id: newValue[i].itemContent.id, name: newValue[i].itemContent.name};
            }
            $scope.typesForCollection = objArray;
          } else {
            $scope.typesForCollection = [];
          }
        }
      );

      /**
       * Creates filter for content types
       * @param query  {string} term
       * @returns {Function}
       */
      function createFilterFor(query) {

        var regex = new RegExp(query, 'i');
        return function filterFn(item) {
          if (item.name.match(regex) !== null) {
            return true;
          }
          return false;
        };
      }

      /**
       * Returns filter
       * @param query {string} term
       * @returns {*}
       */
      function queryTypes(query) {
        return query ? $scope.globalTypes.filter(createFilterFor(query)) : [];

      }

    }


  }

}]);

/**
 * Directive used to associate a TAG with a COLLECTION.
 */
taggerDirectives.directive('subjectSelector', [ function() {

  return {
    restrict: 'E',
    scope: {},
    transclude: true,
    template:
    '<md-card flex>' +
    ' <md-toolbar class="md_primary">' +
    '   <div class="md-toolbar-tools">' +
    '     <i class="material-icons">link</i>' +
    '     <h3 class="md-display-1">&nbsp;Tags</h3>' +
    '     <span flex></span>' +
    '   </div>' +
    ' </md-toolbar>' +
    ' <md-card-content>' +
    '    <div layout="column">' +
    '       <md-input-container>' +
    '         <div layout="column" class="chips">' +
    '           <md-container>' +
    '             <label>Add Tags</label>' +
    '             <md-chips ng-model="tagsForCollection" md-autocomplete-snap="" md-require-match="true" md-on-append="addTag($chip)" md-on-remove="removeTag($chip)">' +
    '               <md-autocomplete md-selected-item="selectedItem" md-min-length="1" md-search-text="searchText" md-no-cache="true" md-items="item in queryTags(searchText)" md-item-text="item.tag">' +
    '                 <span md-highlight-text="searchText"> {{item.tag.name}} </span>' +
    '               </md-autocomplete>' +
    '               <md-chip-template>' +
    '                 <span> {{$chip.name}} </span>' +
    '               </md-chip-template>' +
    '               <button md-chip-remove="" class="md-primary taggerchip">' +
    '                 <md-icon md-svg-icon="md-close"></md-icon>' +
    '            </md-container>' +
    '         </div>' +
    '       </md-input-container>' +
    '     </div>' +
    ' </md-card-content>' +
    '</md-card>',

    controller: function (

      $scope,
      TagsForArea,
      CollectionTagTargetAdd,
      CollectionTagTargetRemove,
      TaggerToast,
      Data ) {


      /**
       * Filter for the md-autocomplete component.
       * @type {queryTags}
       */
      $scope.queryTags = queryTags;

      /** @type {number} */
      $scope.selectedItem = null;

      /** @type {string} */
      $scope.searchText = null;

      /** @type {boolean} */
      $scope.isDisabled = false;

      /** @type {Array.<Object>} */
      $scope.selectedTags = [];

      /** @type {Array.<Object>} */
      $scope.tagsForArea = [];

      /** @type {Array.<Object>} */
      $scope.tagsForCollection = [];

      /**
       * Function called when appending a chip.  The
       * function adds an new subject association for
       * the current collection via db call. Toasts on
       * success.
       * @param chip  {Object} $chip
       * @returns {{id: *, name: *}}
       */
      $scope.addTag = function (chip) {
        var chipObj = {id: chip.tag.id, name: chip.tag.name};
        var result = CollectionTagTargetAdd.query(
          {
            collId: Data.currentCollectionIndex,
            tagId: chip.tag.id
          }
        );
        result.$promise.then(function (data) {
          if (data.status == 'success') {
            TaggerToast('Subject Tag Added');

          } else {
            return {};
            TaggerToast('WARNING: Unable to add subject tag!');

          }
        });

        return chipObj;

      };

      /**
       * Function called when deleting a subject chip.  The function
       * deletes the subject association with this collection
       * via db call. Toasts on success.
       * @param chip  {Object} $chip
       */
      $scope.removeTag = function (chip) {
        var result = CollectionTagTargetRemove.query(
          {
            collId: Data.currentCollectionIndex,
            tagId: chip.id
          }
        );
        result.$promise.then(function (data) {
          if (data.status == 'success') {
            TaggerToast('Subject Tag Removed');
          } else {
            TaggerToast('WARNING: Unable to remove subject tag!');
          }
        });
      };


      /**
       * Watch for changes to the subject tags associated with
       * the collection area.
       */
      $scope.$watch(function () {
          return Data.tagsForArea
        },
        function (newValue) {
          $scope.tagsForArea = newValue;
        }
      );

      /**
       * Watch for changes to the subject tags associated with
       * this collection.
       */
      $scope.$watch(function () {
          return Data.tagsForCollection
        },
        function (newValue) {
          if (newValue.length > 0) {
            var objArray = [];
            for (var i = 0; i < newValue.length; i++) {
              objArray[i] = {id: newValue[i].id, name: newValue[i].name};
            }
            $scope.tagsForCollection = objArray;

          } else {
            $scope.tagsForCollection = [];
          }
        }
      );

      /**
       * Watch for changes to the list of globally available tags.
       * On change, update the tag list for the current area.
       */
      $scope.$watch(function() { return Data.tags},
        function() {
          $scope.tagsForArea = TagsForArea.query({areaId: Data.currentAreaIndex});


        });

      /**
       * Creates a regex filter for the search term
       * @param query {string} term to match
       * @returns {Function}
       */
      function createFilterFor(query) {
        var regex = new RegExp(query, 'i');
        return function filterFn(tagItem) {
          if (tagItem.tag.name.match(regex) !== null) {
            return true;
          }
          return false;
        };
      }

      /**
       * Returns filter.
       * @param query
       * @returns {*}
       */
      function queryTags(query) {
        return query ? $scope.tagsForArea.filter(createFilterFor(query)) : [];

      }
    }

  }

}

]);

/**
 * Directive for adding TAG information to the OVERVIEW.
 */
taggerDirectives.directive('subjectTagSummary', function(){

  return {
    restrict: 'E',
    scope: {},
    template:
      '<div style="margin-top: 40px;padding: 5px;font-size: 0.85em;"><p class=" grey-label">{{subjects}}</p></div>',
    controller: function(
      $scope,
      TagCountForArea,
      Data ) {

      $scope.subjects = '';

      function init() {

        if (Data.currentAreaIndex !== null) {
          var subList = '';
          var subs = TagCountForArea.query({areaId: Data.currentAreaIndex});
          subs.$promise.then(function (data) {
            for (var i = 0; i < data.length; i++) {
              subList = subList + data[i].name + ' (' + data[i].count + ')';
              if (i < data.length - 1) {
                subList = subList + ', ';
              }
            }
            $scope.subjects = subList;
          });
        }
      }
      init();

      $scope.$watch(function() {return Data.currentAreaIndex},
        function(newValue, oldValue){
          if (newValue !== oldValue) {
            init();
          }
        });
    }
  }

});

/**
 * Directive for adding a SEARCH OPTION SUMMARY to the OVERVIEW.
 */
taggerDirectives.directive('searchOptionSummary', function() {

  return {
    restrict: 'E',
    scope: {},
    template:
    '<md-list style="width:100%;margin-top: 40px;">' +
    '   <md-list-item>' +
    '     <p class="grey-label">Search & Browse</p>' +
    '       <p class="list-alignment"> {{default}}</p>' +
    '   </md-list-item>' +
    '   <md-divider/>' +
    '   <md-list-item>' +
    '     <p class="grey-label">Browse Only</p>' +
    '       <p class="list-alignment"> {{browse}}</p>' +
    '   </md-list-item>' +
    '   <md-divider/>' +
    '   <md-list-item>' +
    '     <p class="grey-label">Search Only</p>' +
    '     <p class="list-alignment"> {{search}}</p>' +
    '   </md-list-item>' +
    '   <md-divider/>' +
    '</md-list>',

    controller: function (
      $scope,
      SearchOptionType,
      Data ) {

      $scope.default = 0;
      $scope.search = 0;
      $scope.browse = 0;

      function init()
      {
        if (Data.currentAreaIndex != null) {
          var types =
            SearchOptionType.query({areaId: Data.currentAreaIndex});
          types.$promise.then(function (data) {

            for (var i = 0; i < data.length; i++) {
              if (data[i].repoType === 'DEFAULT') {
                $scope.default = data[i].count;
              } else if (data[i].repoType === 'SEARCH') {
                $scope.search = data[i].count;
              } else if (data[i].repoType === 'BROWSE') {
                $scope.browse = data[i].count;
              }
            }
            Data.searchOptionsTotal = $scope.default + $scope.search + $scope.browse;
          });
        }
      }
      init();

      $scope.$watch(function() {return Data.currentAreaIndex},
        function(newValue, oldValue){
          if (newValue !== undefined) {
            if (newValue !== oldValue) {
              init();
            }
          }
        });
    }
  }
});

/**
 * Directive for adding a CONTENT TYPE SUMMARY information to the OVERVIEW.
 */
taggerDirectives.directive('collectionTypeSummary', function() {

  return {
    restrict: 'E',
    scope: {},
    template:
    '<md-list style="width:100%;margin-top: 40px;">' +
    '   <md-list-item>' +
    '     <p class="grey-label">Collection</p>' +
    '       <p class="list-alignment"> {{digCount}}</p>' +
    '   </md-list-item>' +
    '   <md-divider/>' +
    '   <md-list-item>' +
    '     <p class="grey-label">Single Item</p>' +
    '       <p class="list-alignment"> {{itmCount}}</p>' +
    '   </md-list-item>' +
    '   <md-divider/>' +
    '   <md-list-item>' +
    '     <p class="grey-label">Finding Aid</p>' +
    '     <p class="list-alignment"> {{eadCount}}</p>' +
    '   </md-list-item>' +
    '   <md-divider/>' +
    '</md-list>',

    controller: function (
      $scope,
      CollectionTypeCount,
      Data ) {

      $scope.digCount = 0;
      $scope.itmCount = 0;
      $scope.eadCount = 0;

      function init()
      {

        if (Data.currentAreaIndex !== null) {
          var types =
            CollectionTypeCount.query({areaId: Data.currentAreaIndex});
          types.$promise.then(function (data) {
            for (var i = 0; i < data.length; i++) {
              if (data[i].ctype === 'dig') {
                $scope.digCount = data[i].count;
              } else if (data[i].ctype === 'itm') {
                $scope.itmCount = data[i].count;
              } else if (data[i].ctype === 'aid') {
                $scope.eadCount = data[i].count;
              }
            }
            Data.collectionTypeTotal = $scope.digCount + $scope.itmCount + $scope.eadCount;
          });
        }
      }

      init();

      $scope.$watch(function() {return Data.currentAreaIndex},
        function(newValue, oldValue){
          if (newValue !== undefined) {
            if (newValue !== oldValue) {
              init();
            }
          }
        });
    }
  }
});


/**
 * Directive for adding a COLLECTOINS SUMMARY information to the OVERVIEW.
 */
taggerDirectives.directive('collectionSummary', [function() {
  return {
    restrict: 'E',
    scope: {},
    template:
    '<md-list style="width:100%;margin-top: 40px;">' +
    '   <md-list-item>' +
    '     <p class="grey-label"> Restricted</p>' +
    '       <p class="list-alignment"> {{restricted}}</p>' +
    '   </md-list-item>' +
    '   <md-divider/>' +
    '   <md-list-item>' +
    '     <p class="grey-label"> Public</p>' +
    '     <p class="list-alignment"> {{public}}</p>' +
    '   </md-list-item>' +
    '   <md-divider/>' +
    '   <md-list-item>' +
    '     <p class="grey-label">Total</p>' +
    '       <p class="list-alignment"> {{collections.length}}</p>' +
    '   </md-list-item>' +
    '   <md-divider/>' +
    '</md-list>',

    controller: function (
      $scope,
      CollectionsByArea,
      Data ) {

      $scope.restricted = 0;
      $scope.public = 0;
      $scope.collections = [];

      function init()
      {
        var restrictedCount = 0;
        if (Data.currentAreaIndex !== null) {
          $scope.collections =
            CollectionsByArea.query({areaId: Data.currentAreaIndex});
          $scope.collections.$promise.then(function (data) {
            Data.collectionsTotal = data.length;
            for (var i = 0; i < data.length; i++) {
              if (data[i].collection.restricted !== false) {
                restrictedCount++;
              }
            }
            $scope.restricted = restrictedCount;
            $scope.public = data.length - restrictedCount;


          });
        }
      }

      init();

      $scope.$watch(function() {return Data.currentAreaIndex},
        function(newValue, oldValue){
          if (newValue !== oldValue) {
            init();
          }
        });
    }
  }

}]);

/**
 * Directive for adding COLLECTION LINKS SUMMARY information to the OVERVIEW.
 */
taggerDirectives.directive('linkSummary', [function() {
  return {
    restrict: 'E',
    scope: {},
    template:
    '<md-list style="width:100%;margin-top: 40px;">' +
    '   <md-list-item>' +
    '     <p class="grey-label"> Link</p>' +
    '       <p class="list-alignment"> {{linkCount}}</p>' +
    '   </md-list-item>' +
    '   <md-divider/>' +
    '   <md-list-item>' +
    '     <p class="grey-label"> Selection Menu</p>' +
    '     <p class="list-alignment"> {{selectCount}}</p>' +
    '   </md-list-item>' +
    '   <md-divider/>' +
    '</md-list>',

    controller: function (
      $scope,
      CollectionLinkCount,
      Data ) {

      $scope.linkCount = 0;
      $scope.selectCount = 0;


      function init()
      {
        if (Data.currentAreaIndex !== null) {
          var types =
            CollectionLinkCount.query({areaId: Data.currentAreaIndex});
          types.$promise.then(function (data) {
            for (var i = 0; i < data.length; i++) {
              if (data[i].browseType === 'link') {
                $scope.linkCount = data[i].count;
              } else if (data[i].browseType === 'opts') {
                $scope.selectCount = data[i].count;
              }
            }
            Data.collectionLinksTotal = $scope.linkCount + $scope.selectCount;
          });
        }
      }

      init();

      $scope.$watch(function() {return Data.currentAreaIndex},
        function(newValue, oldValue){
          if (newValue !== oldValue) {
            init();
          }
        });
    }
  }

}]);


/**
 * Directive for the thumbnail image on collection page.
 */
taggerDirectives.directive('thumbImage', function() {
  return {
    restrict: 'E',
    scope: {
      imgname: "@"
    },
    template: '<img style="max-width: 120px;" ng-src="{{thumbnailsrc}}">',
    link:
      function($scope) {

        $scope.$watch(function() {return $scope.imgname} ,
          function(newValue) {
            if (newValue.length > 0) {
              $scope.thumbnailsrc = '/resources/img/thumb/' + newValue;
            } else {
              $scope.thumbnailsrc = '';
            }
          });
      }

  }
});



