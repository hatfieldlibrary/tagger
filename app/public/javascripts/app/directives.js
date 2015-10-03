'use strict';

var taggerDirectives  = angular.module('taggerDirectives', []);

taggerDirectives.directive('d3Pie', ['$window', '$timeout', 'd3Service', function($window, $timeout, d3Service) {

  return {
    // attribute only
    restrict: 'A',
    template: '<svg id="pieChartSVG" style="overflow: visible;"> <defs> <filter id=\'pieChartInsetShadow\'> <feOffset dx=\'0\' dy=\'0\'/> <feGaussianBlur stdDeviation=\'3\' result=\'offset-blur\' /> <feComposite operator=\'out\' in=\'SourceGraphic\' in2=\'offset-blur\' result=\'inverse\' /> <feFlood flood-color=\'black\' flood-opacity=\'1\' result=\'color\' />  <feComposite operator=\'in\' in=\'color\' in2=\'inverse\' result=\'shadow\' /> <feComposite operator=\'over\' in=\'shadow\' in2=\'SourceGraphic\' />  </filter> <filter id="pieChartDropShadow"> <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" /> <feOffset in="blur" dx="0" dy="3" result="offsetBlur" /> <feMerge> <feMergeNode /> <feMergeNode in="SourceGraphic" /> </feMerge> </filter> </defs> </svg>',
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

      // waiting for the d3 object promise
      d3Service.d3().then(function (d3) {

        // d3 code begins here.
        //   function drawPieChart(elementId, input) {

        var total = scope.data.total;
        var data = ratios(scope.data.data);

        function ratios(values) {
          console.log(values);
          var data = [];
          for (var i = 0; i < values.length; i++) {
            console.log(values[i]);
            data[i] = {title: values[i].title, value:  values[i].value / total}
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

        var containerEl = document.getElementById(attrs.id),
          width = containerEl.clientWidth,
          height = width * 0.4,
          radius = Math.min(width, height) / 2,
          container = d3.select(containerEl),
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

        function drawDetailedInformation(data, element) {
          var bBox = element.getBBox(),
            infoWidth = width * 0.3,
            anchor,
            infoContainer,
            position;

          if ((bBox.x + bBox.width / 2) > 0) {
            infoContainer = detailedInfo.append('g')
              .attr('width', infoWidth)
              .attr(
              'transform',
              'translate(' + (width - infoWidth) + ',' + (bBox.height + bBox.y) + ')'
            );
            anchor = 'end';
            position = 'right';
          } else {
            infoContainer = detailedInfo.append('g')
              .attr('width', infoWidth)
              .attr(
              'transform',
              'translate(' + 0 + ',' + (bBox.height + bBox.y) + ')'
            );
            anchor = 'start';
            position = 'left';
          }

          infoContainer.data([data.value * 100])
            .append('text')
            .text('0 %')
            .attr('class', 'pieChart--detail--percentage')
            .attr('x', (position === 'left' ? 0 : infoWidth))
            .attr('y', -10)
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
            .html(data.title);

        }
        // }
      });
    }
  }
}]);
