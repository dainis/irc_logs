/* global EventSource */
'use strict';

var React = require('react/addons'),
    Tabs = require('./Tabs'),
    Stats = require('./Stats'),
    Logs = require('./Logs'),
    $ = require('jquery');

require('normalize.css');
require('../styles/main.less');

var IrcLogsApp = React.createClass({
    getInitialState : function() {
        return {
            selected : 'logs'
        };
    },
    render : function() {
        var content;

        if(this.state.selected === 'stats') {
            content = (<Stats />);
        } else if(this.state.selected === 'logs') {
            content = (<Logs />);
        }

        return (
            <div>
                <Tabs selected={this.state.selected} tabClickCallback={this.onTabClick} />
                {content}
            </div>
        );
    },
    onTabClick : function(tab) {
        this.setState({selected: tab});
    }
});

React.render(<IrcLogsApp />, document.getElementById('content')); // jshint ignore:line

module.exports = IrcLogsApp;
