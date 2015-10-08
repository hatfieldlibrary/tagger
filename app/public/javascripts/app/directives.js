'use strict';

var taggerDirectives  = angular.module('taggerDirectives', []);

taggerDirectives.directive('elemReady', function( $parse ) {
  return {
    restrict: 'A',
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

taggerDirectives.directive('d3Pie', ['$window', '$timeout', 'd3Service', function($window, $timeout, d3Service) {

  return {
    // attribute only
    restrict: 'A',
    template: '<svg id="pieChartSVG" style="overflow: visible;"> ' +
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
    '         </svg>',
    // creating scope object isolates
    scope: {
      data: '=',      // bi-directional binding of data
      label: '@'
    },
    // Angular link function
    link: function (scope, ele, attrs) {

      var DURATION = 1500;
      var DELAY    = 500;
      var colors = ['red', 'green', 'blue', 'yellow', 'indigo'];
      var colorIndex = 0;

      function ratios(values, total) {
        console.log(values);
        var data = [];
        for (var i = 0; i < values.length; i++) {
          console.log(values[i]);
          data[i] = {title: values[i].title, value:  values[i].value / total, count: values[i].value}
        }
        return data;
      }

      function colorWheel() {
        var color = colors[colorIndex];
        if (colorIndex == 4) {
          colorIndex = 0;
        } else {
          colorIndex++;
        }
        return color;
      }

      // waiting for the d3 object promise
      d3Service.d3().then(function (d3) {

        var total = 0;
        var data = [];

        // initialize on data change
        scope.$watch(function(scope) { return scope.data },
          function() {
            if (scope.data !== undefined) {
              colorIndex = 0;
              total = scope.data.total;
              if (scope.data.data.length > 0) {
                data = ratios(scope.data.data, total);
                drawPieChart();
              } else {
                clearChart();
              }
            }
          });


        // d3 code begins here.

        /**
         * Clear the chart.  This will be called when an empty
         * data array is passed to the directive.
         */
        function clearChart() {
          var containerEl = document.getElementById(attrs.id),
            container = d3.select(containerEl),
            svg = container.select('svg');
          svg.selectAll('g').remove();
          svg.select('circle').remove();

        }

        /**
         * Draws the pie chart
         */
        function drawPieChart() {

          var containerEl = document.getElementById(attrs.id),
            width = containerEl.clientWidth,
            height = width * 0.4,
            radius = Math.min(width, height) / 2,
            container = d3.select(containerEl),
            svg = container.select('svg')
              .attr('width', width)
              .attr('height', height);

          svg.selectAll('g').remove();

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
            .outerRadius(radius - 20)
            .innerRadius(0);

          var pieChartPieces = pie.datum(data)
            .selectAll('path')
            .data(pieData)
            .enter()
            .append('path')
            .attr('class', function (d) {
              return 'pieChart__' + colorWheel();
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
              drawDetailedInformation(d.data, this);
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
              .attr('r', radius - 50);

            centerContainer.append('circle')
              .attr('id', 'pieChart-clippy')
              .attr('class', 'pieChart--center--innerCircle')
              .attr('r', 0)
              .transition()
              .delay(DELAY)
              .duration(DURATION)
              .attr('r', radius - 55)
              .attr('fill', '#fff');
          }

          /**
           * Using this hack to test for equivalent svg.bBox heights.
           * This handles an edge case in which two detail entries
           * with the same percentage overlap in the left column of the
           * view.  There may be other edge cases, so stay tuned for more
           * hacks.
           * @type {boolean}
           */
          var hackyTest = false;

          /**
           * Adds the detail information sections to the chart.
           * @param data  {Array} of objects containing details
           * @param element
           */
          function drawDetailedInformation(data, element) {


            var bBox = element.getBBox(),
              infoWidth = width * 0.3,
              anchor,
              infoContainer,
              position;


            if (infoContainer !== undefined) {
              infoContainer.empty();
            }

            var trans;
            /* apply hack */
            if ((bBox.height + bBox.y + 60) === 60)  {
              if (hackyTest === false)  {
                hackyTest = true;
                trans =  bBox.height + bBox.y + 60;
              }
              else  if (hackyTest === true)
              {
                trans = bBox.height + bBox.y + 60;
              }
            } else {
              trans = bBox.height + bBox.y + 60;
            }
            if ((bBox.x + bBox.width / 2) > 0) {
              infoContainer = detailedInfo.append('g')
                .attr('width', infoWidth)
                .attr(
                'transform',
                'translate(' + (width - infoWidth) + ',' + (bBox.height + bBox.y + 60) + ')'

              );
              anchor = 'end';
              position = 'right';
            } else {

              infoContainer = detailedInfo.append('g')
                .attr('width', infoWidth)
                .attr(
                'transform',
                'translate(' + 0 + ',' + trans + ')'
              );
              anchor = 'start';
              position = 'left';
            }

            infoContainer.data([data.value * 100])
              .append('text')
              .text('0 %')
              .attr('class', 'pieChart--detail--percentage')
              .attr('x', (position === 'left' ? 0 : infoWidth))
              .attr('y', -5)
              .attr('text-anchor', anchor)
              .transition()
              .duration(DURATION)
              .tween('text', function (d) {
                var i = d3.interpolateRound(+this.textContent.replace(/\s%/ig, ''),
                  d
                );

                return function (t) {
                  this.textContent = i(t) + ' %';
                };
              });

            infoContainer.append('line')
              .attr('class', 'pieChart--detail--divider')
              .attr('x1', 0)
              .attr('x2', 0)
              .attr('y1', 0)
              .attr('y2', 0)
              .transition()
              .duration(DURATION)
              .attr('x2', infoWidth);

            infoContainer.data([data.title])
              .append('foreignObject')
              .attr('width', infoWidth)
              .attr('height', 100)
              .append('xhtml:body')
              .attr(
              'class',
              'pieChart--detail--textContainer ' + 'pieChart--detail__' + position
            )
              .html(data.title + ' (' + data.count + ')');

          }
        }
      });
    }
  };

}]);

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
       * Searches for area id in the current list of
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


taggerDirectives.directive('contentTypeSelector', [ function() {

  return {
    restrict: 'E',
    scope: {},
    transclude: true,
    template:
    '<md-card flex>' +
    ' <md-toolbar class="md_primary">' +
    '   <div class="md-toolbar-tools">' +
    '     <i class="material-icons">link</i>' +
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
      Data
    ) {


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
        console.log('current collection ' + Data.currentCollectionIndex);
        console.log('got chip id ' + chip.id);
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
              console.log(newValue[i]);
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
        console.log('current collection ' + Data.currentCollectionIndex);
        console.log('got chip id ' + chip.id);
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
        console.log(query);
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

        console.log(query);
        return query ? $scope.tagsForArea.filter(createFilterFor(query)) : [];

      }
    }

  }

}

]);



