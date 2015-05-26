'use strict';

describe('MessageList', function () {
  var React = require('react/addons');
  var MessageList, component;

  beforeEach(function () {
    MessageList = require('components/MessageList.js');
    component = React.createElement(MessageList);
  });

  it('should create a new instance of MessageList', function () {
    expect(component).toBeDefined();
  });
});
