'use strict';

describe('IRCHistory', function () {
  var React = require('react/addons');
  var IRCHistory, component;

  beforeEach(function () {
    IRCHistory = require('components/IRCHistory.js');
    component = React.createElement(IRCHistory);
  });

  it('should create a new instance of IRCHistory', function () {
    expect(component).toBeDefined();
  });
});
