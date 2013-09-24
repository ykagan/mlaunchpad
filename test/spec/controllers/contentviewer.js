'use strict';

describe('Controller: ContentviewerCtrl', function () {

  // load the controller's module
  beforeEach(module('cgAngularApp'));

  var ContentviewerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ContentviewerCtrl = $controller('ContentviewerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
