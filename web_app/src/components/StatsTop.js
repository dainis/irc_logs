'use strict';

var React = require('react/addons'),
    Loading = require('./Loading'),
    TopEntry = require('./StatsTopEntry'),
    $ = require('jquery');

require('styles/StatsTop.less');

var StatsTop = React.createClass({
    getInitialState : function() {
        return {
            loaded : false,
            top : []
        };
    },
    componentWillMount : function() {
        $.get('/stats/' + this.props.endpoint, (function(data) {
            this.setState({loaded : true, top: data});
        }).bind(this));
    },
    createEntry : function(entry) {
        return (<TopEntry key={entry.key} entry={entry}/>);
    },
    render: function () {
        var content;

        if(this.state.loaded) {
            content = (
                <ol className="TopList">
                    {this.state.top.map(this.createEntry)}
                </ol>
            );
        } else {
            content = (<Loading />);
        }
        return (
            <div className="StatsTop">
                <h2>{this.props.title}</h2>
                {content}
            </div>
        );
    }
});

module.exports = StatsTop;

