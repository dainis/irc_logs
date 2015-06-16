'use strict';

describe('StatsHistogram', function () {
  var React = require('react/addons');
  var StatsHistogram, component;

  beforeEach(function () {
    StatsHistogram = require('components/StatsHistogram.js');
    component = React.createElement(StatsHistogram);
  });

  it('should create a new instance of StatsHistogram', function () {
    expect(component).toBeDefined();
  });
});
