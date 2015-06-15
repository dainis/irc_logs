'use strict';

var React = require('react/addons'),
    moment = require('moment');

require('styles/Title.less');

var Title = React.createClass({
    render: function () {
        var color = this.props.connected ? 'green' : 'red',
            date = this.props.days !== 0 ? moment().subtract('days', this.props.days).format('MMMM Do YYYY') : 'last 24H';

        return (
            <h1 className="Title" style={{color: color}}>#developerslv history : {date}</h1>
        );
    }
});

module.exports = Title;
