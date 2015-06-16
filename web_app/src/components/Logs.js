/* global EventSource */
'use strict';

var React = require('react/addons'),
    MessageList = require('./MessageList'),
    Loading = require('./Loading'),
    Title = require('./Title'),
    DatePicker = require('./DatePicker'),
    $ = require('jquery');

var Logs = React.createClass({
    getInitialState : function() {
        return {
            connected : false,
            messages  : [],
            loaded    : false,
            days      : 0
        };
    },
    initList : function() {
        this.loadHistoricFromServer();

        if(this.eventSource !== undefined && this.eventSource.readyState !== EventSource.CLOSED) {
            this.setState({connected : true});
            return;
        }

        this.eventSource = new EventSource('/subscribe');

        this.eventSource.addEventListener('message', (function(e) {
            console.log('Got message', e.data);
            this.addMessage(e.data);
        }).bind(this), false);

        this.eventSource.addEventListener('open', (function(e) {
            console.log('Connected to server');
            this.setState({connected : true});
        }).bind(this), false);

        this.eventSource.addEventListener('error', (function(e) {
            if (e.target.readyState === EventSource.CLOSED) {
                console.log('Diconnected from server');
                this.setState({connected : false});
            }
        }).bind(this), false);
    },
    addMessage : function(message) {
        var messages = this.state.messages;
        messages.push(JSON.parse(message));
        this.setState({messages : messages});
    },
    componentWillMount : function() {
        this.initList();
    },
    componentWillUnmount : function() {
        if(this.eventSource) {
            this.eventSource.close();
        }
    },
    render : function() {
        if(this.state.loaded) {
            return (
                <div>
                    <Title connected={this.state.connected} days={this.state.days}/>
                    <DatePicker dateChangeCallback={this.dateChangeCallback}/>
                    <MessageList messages={this.state.messages}/>
                </div>
            );
        } else {
            return (
                <div>
                    <Title connected={this.state.connected} days={this.state.days}/>
                    <Loading />
                </div>
            );
        }

    },
    dateChangeCallback : function(days) {
        this.setState({
            days      : days,
            loaded    : false,
            connected : false
        });

        if(days === 0) {
            return this.initList();
        }

        var currentDate = new Date(),
            fromDate = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate() - days),
            toDate = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate() - days + 1);

        this.eventSource.close();
        this.loadHistoricFromServer(fromDate, toDate);
    },
    loadHistoricFromServer : function(from, to) {
        $.get('/load', {from : from ? from.toISOString() : undefined, to : to ? to.toISOString() : undefined}, (function(results) {
            this.setState({
                loaded   : true,
                messages : results
            });
        }).bind(this));
    }
});

module.exports = Logs;
