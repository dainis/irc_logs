'use strict';

var React = require('react/addons'),
    classNames = require('classnames');

require('styles/Tabs.less');

var Tabs = React.createClass({

    render: function () {
      var logsClasses = classNames('Tab', {
              Selected : this.props.selected === 'logs'
          }),
          statsClasses = classNames('Tab', {
              Selected : this.props.selected === 'stats'
          });
      return (
          <div className="Tabs">
            <a href="#logs" className={logsClasses} onClick={this.onTabClick.bind(this, 'logs')}>Logs</a>
            <a href="#stats" className={statsClasses} onClick={this.onTabClick.bind(this, 'stats')}>Stats</a>
          </div>
        );
    },
    onTabClick : function(tab, e) {
        e.preventDefault();
        this.props.tabClickCallback(tab);
    }
});

module.exports = Tabs;

