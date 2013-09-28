'use strict';

describe('Service: getitemlist', function () {

  // load the service's module
  beforeEach(module('cgAngularApp'));

  // instantiate service
  var getitemlist;
  beforeEach(inject(function (_getitemlist_) {
    getitemlist = _getitemlist_;
  }));

  it('should do something', function () {
    expect(!!getitemlist).toBe(true);
  });

});
