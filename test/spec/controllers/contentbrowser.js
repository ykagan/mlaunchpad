'use strict';

describe('Controller: ContentbrowserCtrl', function () {

  // load the controller's module
  beforeEach(module('cgAngularApp'));

  var ContentbrowserCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ContentbrowserCtrl = $controller('ContentbrowserCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
