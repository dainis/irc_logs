'use strict';

var React = require('react/addons'),
    moment = require('moment');

require('styles/Message.less');

var Message = React.createClass({
    render: function () {
      	var message = this.props.message,
      		d = moment(message.date).format('MMMM Do YYYY, HH:mm:ss');

        return (
            <div className="Message">
                <span className="Header">{message.from} @ {d}</span>
                <p className="Body">{message.message}</p>
            </div>
        );
    }
});

module.exports = Message;
