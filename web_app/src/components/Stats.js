'use strict';

var React = require('react/addons'),
    Top = require('./StatsTop'),
    Histogram = require('./StatsHistogram');

require('styles/Stats.less');

var Stats = React.createClass({
    render: function () {
        return (
            <div className="Stats">
              <Histogram />
              <Top />
            </div>
          );
    }
});

module.exports = Stats;

