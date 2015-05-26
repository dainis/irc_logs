'use strict';

var React = require('react/addons');

require('styles/Title.less');

var Title = React.createClass({
    render: function () {
        var color = this.props.connected ? 'green' : 'red';
        return (
            <h1 style={{color: color}}>#developerslv history</h1>
        );
    }
});

module.exports = Title;
