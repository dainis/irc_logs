'use strict';

describe('IrcLogsApp', function () {
  var React = require('react/addons');
  var IrcLogsApp, component;

  beforeEach(function () {
    var container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    IrcLogsApp = require('components/IrcLogsApp.js');
    component = React.createElement(IrcLogsApp);
  });

  it('should create a new instance of IrcLogsApp', function () {
    expect(component).toBeDefined();
  });
});
