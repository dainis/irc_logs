'use strict';

var React = require('react/addons');


require('styles/StatsTopEntry.less');

var StatsTopEntry = React.createClass({

  render: function () {
    return (
        <li className={'StatsTopEntry'}>{this.props.entry.key} : {this.props.entry.docCount} messages</li>
      );
  }
});

module.exports = StatsTopEntry;

