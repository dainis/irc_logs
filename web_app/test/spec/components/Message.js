'use strict';

describe('Message', function () {
  var React = require('react/addons');
  var Message, component;

  beforeEach(function () {
    Message = require('components/Message.js');
    component = React.createElement(Message);
  });

  it('should create a new instance of Message', function () {
    expect(component).toBeDefined();
  });
});
