'use strict';

describe('Stats', function () {
  var React = require('react/addons');
  var Stats, component;

  beforeEach(function () {
    Stats = require('components/Stats.js');
    component = React.createElement(Stats);
  });

  it('should create a new instance of Stats', function () {
    expect(component).toBeDefined();
  });
});
