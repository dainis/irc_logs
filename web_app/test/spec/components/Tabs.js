'use strict';

describe('Tabs', function () {
  var React = require('react/addons');
  var Tabs, component;

  beforeEach(function () {
    Tabs = require('components/Tabs.js');
    component = React.createElement(Tabs);
  });

  it('should create a new instance of Tabs', function () {
    expect(component).toBeDefined();
  });
});
