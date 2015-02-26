'use strict';

angular.module('ngDecoratedQ', []).config(function($provide) {
  $provide.decorator('$q', function($delegate) {

    // Extend promises with non-returning handlers
    function decoratePromise(promise) {
      promise._then = promise.then;
      var timeoutId;

      promise.then = function(thenFn, errFn, notifyFn) {
        return decoratePromise(promise._then(thenFn, errFn, notifyFn));
      };

      promise.success = function (fn) {
        return promise.then(function (value) {
          fn(value);
        });
      };

      promise.error = function (fn) {
        return promise.then(null, function (value) {
          fn(value);
        });
      };

      promise.thenSet = function(obj, varName) {
        return promise.success(function(data) {
          obj[varName] = data;
        });
      };

      promise.setWhileLoading = function(obj, varName) {
        obj[varName] = true;
        return promise.finally(function() {
          obj[varName] = false;
        });
      };

      // TODO

      promise.timeout = function(ms, fn) {
        timeoutId = setTimeout(function() {
          fn();
        }, ms);
        return promise.finally(function() {
          clearTimeout(timeoutId);
        });
      };

      // promise.timeout = function(ms, fn) {
      //   timeout = $timeout(function() {
      //     fn();
      //   }, ms);
      //   var cancelTimeout = function() {
      //     timeout.cancel();
      //   };
      //   promise.then(cancelTimeout, cancelTimeout);
      //   return promise;
      // };

      return promise;
    }

    var defer = $delegate.defer,
        when = $delegate.when,
        reject = $delegate.reject,
        all = $delegate.all;
    $delegate.defer = function() {
      var deferred = defer();
      decoratePromise(deferred.promise);
      return deferred;
    };
    $delegate.when = function() {
      return decoratePromise(when.apply(this, arguments));
    };
    $delegate.reject = function() {
      return decoratePromise(reject.apply(this, arguments));
    };
    $delegate.all = function() {
      return decoratePromise(all.apply(this, arguments));
    };

    return $delegate;

  });
});
