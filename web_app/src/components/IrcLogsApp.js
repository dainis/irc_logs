/* global EventSource */
'use strict';

var React = require('react/addons'),
    MessageList = require('./MessageList'),
    Loading = require('./Loading'),
    Title = require('./Title'),
    $ = require('jquery');

require('normalize.css');
require('../styles/main.less');

var IrcLogsApp = React.createClass({
    getInitialState : function() {
        return {
            connected : false,
            messages  : [],
            loaded    : false
        };
    },
    initList : function() {
        var eventSource = new EventSource('/subscribe');

        eventSource.addEventListener('message', (function(e) {
            console.log('Got message', e.data);
            this.addMessage(e.data);
        }).bind(this), false);

        eventSource.addEventListener('open', (function(e) {
            console.log('Connected to server');
            this.setState({connected : true});
        }).bind(this), false);

        eventSource.addEventListener('error', (function(e) {
            if (e.target.readyState === EventSource.CLOSED) {
                console.log('Diconnected from server');
                this.setState({connected : false});
            }
        }).bind(this), false);

        this.loadHistoricFromServer();
    },
    addMessage : function(message) {
        var messages = this.state.messages;
        messages.push(JSON.parse(message));
        this.setState({messages : messages});
    },
    componentWillMount : function() {
        this.initList();
    },
    render : function() {
        if(this.state.loaded) {
            return (
                <div>
                    <Title connected={this.state.connected}/>
                    <MessageList messages={this.state.messages}/>
                </div>
            );
        } else {
            return (
                <div>
                    <Title connected={this.state.connected}/>
                    <Loading />
                </div>
            );
        }

    },
    loadHistoricFromServer : function() {
        $.get('/load', (function(results) {
            this.setState({
                loaded   : true,
                messages : results
            });
        }).bind(this));
    }
});

React.render(<IrcLogsApp />, document.getElementById('content')); // jshint ignore:line

module.exports = IrcLogsApp;
