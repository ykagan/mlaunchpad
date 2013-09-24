'use strict';

describe('Service: getcontainer', function () {

  // load the service's module
  beforeEach(module('cgAngularApp'));

  // instantiate service
  var getcontainer;
  beforeEach(inject(function (_getcontainer_) {
    getcontainer = _getcontainer_;
  }));

  it('should do something', function () {
    expect(!!getcontainer).toBe(true);
  });

});
