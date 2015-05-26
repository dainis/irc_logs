'use strict';

require('styles/Loading.less');

var React = require('react/addons'),
    spinnerUrl = require('../images/ajax-loader.gif');

var Loading = React.createClass({
    render: function () {
        return (
            <div className="Loading">
                <img src={spinnerUrl}/>
            </div>
        );
    }
});

module.exports = Loading;
