'use strict';

describe('StatsTopEntry', function () {
  var React = require('react/addons');
  var StatsTopEntry, component;

  beforeEach(function () {
    StatsTopEntry = require('components/StatsTopEntry.js');
    component = React.createElement(StatsTopEntry);
  });

  it('should create a new instance of StatsTopEntry', function () {
    expect(component).toBeDefined();
  });
});
