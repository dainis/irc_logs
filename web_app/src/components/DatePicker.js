'use strict';

var React = require('react/addons');

require('styles/DatePicker.less');

var DatePicker = React.createClass({
    render: function () {
        return (
            <div className="DatePicker">
                <a className="Date" href="#last-24h" onClick={this.clickHandler.bind(this, 0)}>Last 24h</a>
                <a className="Date" href="#last-24h" onClick={this.clickHandler.bind(this, 1)}>Yesterday</a>
                <a className="Date" href="#last-24h" onClick={this.clickHandler.bind(this, 2)}>2 days ago</a>
            </div>
        );
    },
    clickHandler : function(days) {
        this.props.dateChangeCallback(days);
    }
});

module.exports = DatePicker;

