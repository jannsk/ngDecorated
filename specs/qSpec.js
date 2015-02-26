'use strict';

describe('decoratedQ', function() {
  var service, scope;

  beforeEach(module('ngDecoratedQ'));
  beforeEach(inject(function($q, $rootScope) {
      service = $q;
      scope = $rootScope;
      jasmine.clock().install();
  }));
  afterEach(function() {
    jasmine.clock().uninstall();
  });

  describe('should not break default functionality', function() {

    describe('#then', function() {
      it('promise.resolve', function() {
        var success;
        var error;
        var p = service.defer();
        p.promise.then(function(data) {
          success = data;
        }, function(data) {
          error = data;
        });

        p.resolve(true);
        scope.$digest();

        expect(success).toBe(true);
        expect(error).toBeUndefined();
      });
      it('promise.reject', function() {
        var success;
        var error;
        var p = service.defer();
        p.promise.then(function(data) {
          success = data;
        }, function(data) {
          error = data;
        });

        p.reject(true);
        scope.$digest();

        expect(success).toBeUndefined();
        expect(error).toBe(true);
      });
    });

    describe('#catch', function() {
      it('promise.resolve', function() {
        var error;
        var p = service.defer();
        p.promise.catch(function(data) {
          error = data;
        });

        p.resolve(true);
        scope.$digest();

        expect(error).toBeUndefined();
      });
      it('promise.reject', function() {
        var error;
        var p = service.defer();
        p.promise.catch(function(data) {
          error = data;
        });

        p.reject(true);
        scope.$digest();

        expect(error).toBe(true);
      });
    });

    describe('#finally', function() {
      it('promise.resolve', function() {
        var called;
        var p = service.defer();
        p.promise.finally(function() {
          called = true;
        });

        p.resolve(true);
        scope.$digest();

        expect(called).toBe(true);
      });
      it('promise.reject', function() {
        var called;
        var p = service.defer();
        p.promise.finally(function() {
          called = true;
        });

        p.reject(true);
        scope.$digest();

        expect(called).toBe(true);
      });
    });

    it('#all', function() {
      var called = false;
      var p1 = service.defer();
      var p2 = service.defer();
      service.all([p1.promise, p2.promise]).finally(function() {
        called = true;
      });

      scope.$digest();
      expect(called).toBe(false);

      p1.resolve();
      scope.$digest();
      expect(called).toBe(false);

      p2.resolve();
      scope.$digest();
      expect(called).toBe(true);
    });

    describe('#when', function() {
      it('no promise', function() {
        var called = false;
        service.when('test string').finally(function() {
          called = true;
        });

        scope.$digest();
        expect(called).toBe(true);
      });
      it('promise', function() {
        var called = false;
        var p = service.defer();
        service.when(p.promise).finally(function() {
          called = true;
        });

        scope.$digest();
        expect(called).toBe(false);

        p.resolve();
        scope.$digest();
        expect(called).toBe(true);
      });
    });

  });

  describe('#success', function() {
    it('promise.resolve', function() {
      var called = false;
      var p = service.defer();
      p.promise.success(function(data) {
        called = data;
      });

      scope.$digest();
      expect(called).toBe(false);

      p.resolve(true);
      scope.$digest();
      expect(called).toBe(true);
    });
    it('promise.reject', function() {
      var called = false;
      var p = service.defer();
      p.promise.success(function(data) {
        called = data;
      });

      p.reject(true);
      scope.$digest();
      expect(called).toBe(false);
    });
  });

  describe('#error', function() {
    it('promise.resolve', function() {
      var called = false;
      var p = service.defer();
      p.promise.error(function(data) {
        called = data;
      });

      scope.$digest();
      expect(called).toBe(false);

      p.resolve(true);
      scope.$digest();
      expect(called).toBe(false);
    });
    it('promise.reject', function() {
      var called = false;
      var p = service.defer();
      p.promise.error(function(data) {
        called = data;
      });

      p.reject(true);
      scope.$digest();
      expect(called).toBe(true);
    });
  });

  describe('#thenSet', function() {
    it('promise.resolve', function() {
      scope.users = {};
      var p = service.defer();
      p.promise.thenSet(scope.users, 'user');

      scope.$digest();
      expect(scope.users.user).toBeUndefined();

      p.resolve(true);
      scope.$digest();
      expect(scope.users.user).toBe(true);
    });
    it('promise.reject', function() {
      scope.users = {};
      var p = service.defer();
      p.promise.thenSet(scope.users, 'user');

      p.reject(true);
      scope.$digest();
      expect(scope.users.user).toBeUndefined();
    });
  });

  describe('#setWhileLoading', function() {
    it('promise.resolve', function() {
      var p = service.defer();
      p.promise.setWhileLoading(scope, 'isLoading');

      scope.$digest();
      expect(scope.isLoading).toBe(true);

      p.resolve(true);
      scope.$digest();
      expect(scope.isLoading).toBe(false);
    });
    it('promise.reject', function() {
      var p = service.defer();
      p.promise.setWhileLoading(scope, 'isLoading');

      scope.$digest();
      expect(scope.isLoading).toBe(true);

      p.reject(true);
      scope.$digest();
      expect(scope.isLoading).toBe(false);
    });
  });

  describe('#timeout', function() {
    it('resolved/rejected before timeout', function() {
      scope.called = false;
      var p = service.defer();
      p.promise.timeout(10, function() {
        scope.called = true;
      });

      jasmine.clock().tick(9);
      scope.$digest();
      expect(scope.called).toBe(false);

      p.reject();
      scope.$digest();
      expect(scope.called).toBe(false);
    });
    it('resolved/rejected after timeout', function() {
      scope.called = false;
      scope.finally = false;
      var p = service.defer();
      p.promise.timeout(10, function() {
        scope.called = true;
      }).finally(function() {
        scope.finally = true;
      });

      jasmine.clock().tick(10);
      expect(scope.called).toBe(true);
      expect(scope.finally).toBe(false);

      p.resolve();
      scope.$digest();
      expect(scope.called).toBe(true);
      expect(scope.finally).toBe(true);
    });
  });

  describe('#timeoutAndReject', function() {
    describe('before timeout', function() {
      it('resolved', function() {
        scope.success = false;
        scope.error = false;
        var p = service.defer();
        p.promise.timeoutAndReject(10).then(function() {
          scope.success = true;
        }, function() {
          scope.error= true;
        });

        jasmine.clock().tick(9);
        scope.$digest();
        expect(scope.success).toBe(false);
        expect(scope.error).toBe(false);

        p.resolve();
        scope.$digest();
        expect(scope.success).toBe(true);
        expect(scope.error).toBe(false);

        jasmine.clock().tick(1);
        scope.$digest();
        expect(scope.success).toBe(true);
        expect(scope.error).toBe(false);
      });
      it('rejected', function() {
        scope.success = false;
        scope.error = false;
        var p = service.defer();
        p.promise.timeoutAndReject(10).then(function() {
          scope.success = true;
        }, function() {
          scope.error= true;
        });

        jasmine.clock().tick(5);
        scope.$digest();
        expect(scope.success).toBe(false);
        expect(scope.error).toBe(false);

        p.reject();
        scope.$digest();
        expect(scope.success).toBe(false);
        expect(scope.error).toBe(true);

        jasmine.clock().tick(5);
        scope.$digest();
        expect(scope.success).toBe(false);
        expect(scope.error).toBe(true);
      });
    });
    it('after timeout resolved/rejected', function() {
      scope.success = false;
      scope.error = false;
      var p = service.defer();
      p.promise.timeoutAndReject(10).then(function() {
        scope.success = true;
      }, function() {
        scope.error= true;
      });

      jasmine.clock().tick(10);
      scope.$digest();
      expect(scope.success).toBe(false);
      expect(scope.error).toBe(true);

      p.resolve();
      scope.$digest();
      expect(scope.success).toBe(false);
      expect(scope.error).toBe(true);
    });
  });

});
