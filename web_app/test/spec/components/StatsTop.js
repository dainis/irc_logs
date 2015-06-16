'use strict';

describe('StatsTop', function () {
  var React = require('react/addons');
  var StatsTop, component;

  beforeEach(function () {
    StatsTop = require('components/StatsTop.js');
    component = React.createElement(StatsTop);
  });

  it('should create a new instance of StatsTop', function () {
    expect(component).toBeDefined();
  });
});
