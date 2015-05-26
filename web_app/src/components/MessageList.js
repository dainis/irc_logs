'use strict';

var React = require('react/addons'),
    Message = require('./Message'),
    $ = require('jquery');

require('styles/MessageList.less');

var MessageList = React.createClass({
    componentDidMount : function() {
        this.firstScroll = false;
	},
    componentWillUpdate: function() {
        this.shouldScrollBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
    },
    componentDidUpdate: function() {
        if (this.shouldScrollBottom || !this.firstScroll) {
            var lastElement = $('.MessageList .Message').last()[0];

            if(lastElement) {
                lastElement.scrollIntoView();
            }

            this.firstScroll = true;
        }
    },
    render: function () {
        function createMessage(m) {
            return (<Message message={m}/>);
        }

        return (
            <div className="MessageList">
                <ul>
                    {this.props.messages.map(createMessage)}
                </ul>
            </div>
        );
    }
});

module.exports = MessageList;
