'use strict';

describe('Title', function () {
  var React = require('react/addons');
  var Title, component;

  beforeEach(function () {
    Title = require('components/Title.js');
    component = React.createElement(Title);
  });

  it('should create a new instance of Title', function () {
    expect(component).toBeDefined();
  });
});
