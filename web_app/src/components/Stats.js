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
              <Top endpoint="top24h" title="Top spammers in last 24h" />
              <Top endpoint="overall" title="Top overall spammers" />
            </div>
          );
    }
});

module.exports = Stats;

