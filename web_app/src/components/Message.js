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
                <span className="Header">{d} | {message.from}</span>
                <span className="Seperator"> : </span>
                <span className="Body">{message.message}</span>
            </div>
        );
    }
});

module.exports = Message;
