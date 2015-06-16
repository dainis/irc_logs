'use strict';

var React = require('react/addons'),
    Loading = require('./Loading'),
    $ = require('jquery'),
    ChartistGraph = require('react-chartist');

require('styles/StatsHistogram.less');
require('styles/chartist.min.css');

var StatsHistogram = React.createClass({
    getInitialState : function() {
        return {
            loaded : false,
            histogramData : null,
            chartOptions : {
                low : 0,
                seriesBarDistance : 0,
                stretch : true,
                axisX: {
                    offset : 60,

                    labelOffset : {
                        x : -20,
                        y : 0
                    }
                },
            }
        };
    },
    componentDidUpdate : function() {
        var $chart = $('.ct-chart'),
            $toolTip = $chart
                .append('<div class="tooltip"></div>')
                .find('.tooltip')
                .hide();

        $chart.on('mouseenter', '.ct-bar', function() {
            var $point = $(this),
                value = $point.attr('ct:value');

            $toolTip.html(value).show();
        });

        $chart.on('mouseleave', '.ct-bar', function() {
            $toolTip.hide();
        });

        $chart.on('mousemove', function(event) {
            $toolTip.css({
                left: (event.offsetX || event.originalEvent.layerX) - $toolTip.width() / 2 - 10,
                top: (event.offsetY || event.originalEvent.layerY) - $toolTip.height() + 40
            });
        });
    },
    componentWillMount : function() {
        $.get('/stats/histogram', (function(data) {
            var histogramData = {
                labels : [],
                series : [[]]
            };

            data.forEach(function(entry) {
                histogramData.labels.push(entry.date);
                histogramData.series[0].push(entry.docCount);
            });

            this.setState({
                loaded        : true,
                histogramData : histogramData
            });
        }).bind(this));
    },
    render: function () {
        var content;
        if(this.state.loaded) {
            content = (<ChartistGraph data={this.state.histogramData} options={this.state.chartOptions} type={'Bar'}/>);
        } else {
            content = (<Loading />);
        }
        return (
            <div className="StatsHistogram">
                <h2>Daily message count</h2>
                {content}
            </div>
        );
    }
});

module.exports = StatsHistogram;

