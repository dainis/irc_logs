'use strict';

describe('Logs', function () {
  var React = require('react/addons');
  var Logs, component;

  beforeEach(function () {
    Logs = require('components/Logs.js');
    component = React.createElement(Logs);
  });

  it('should create a new instance of Logs', function () {
    expect(component).toBeDefined();
  });
});
