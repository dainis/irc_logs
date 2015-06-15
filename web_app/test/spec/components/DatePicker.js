'use strict';

describe('DatePicker', function () {
  var React = require('react/addons');
  var DatePicker, component;

  beforeEach(function () {
    DatePicker = require('components/DatePicker.js');
    component = React.createElement(DatePicker);
  });

  it('should create a new instance of DatePicker', function () {
    expect(component).toBeDefined();
  });
});
