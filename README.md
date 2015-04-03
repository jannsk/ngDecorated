# ngDecorated

A small collection of decorated AngularJS services that will make your life easier.

## Installation

- Download files (bower will come in the future)
- Add module "ngDecoratedQ" to your AngularJS application
```javascript
angular.module('APP_NAME', ['ngDecoratedQ']);
```
- Make us of the improvements

## Documentation

**promise.success(fn)**

Call _fn_ when promise gets resolved.

```javascript
$http.get(url).success(function(data) {
	$scope.data = data;
});
```

**promise.error(fn)**

Call _fn_ when promise gets rejected.

```javascript
$http.get(url).error(function(rejection) {
	$scope.errorMessage = rejection;
});
```

**promise.thenSet(obj, variableName)**

Set variable _obj_._variableName_ to resolved data.

```javascript
$http.get(url).thenSet($scope, 'data');
```

**promise.setWhileLoading(obj, variableName)**

Set variable _obj_._variableName_ while promise is not resolved/rejected.

```javascript
$http.get(url).setWhileLoading($scope, 'isLoading');
```

**promise.timeout(ms, fn)**

Timeout the promise after _ms_ milliseconds. Call _fn_ when promise is timed out.

```javascript
$http.get(url).timeout(1000, function() {
	$scope.errorMessage = 'Request did not respond within 1 second. Abording...';
});
```

**promise.timeoutAndReject(ms)**

Timeout the promise after _ms_ milliseconds.

```javascript
$http.get(url).timeoutAndReject(1000).error(function() {
	$scope.errorMessage = 'The promise is rejected by timeout or by rejection';
});
```

