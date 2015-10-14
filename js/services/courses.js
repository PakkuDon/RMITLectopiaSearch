app.factory('courses', ['$http', function($http) {
    return $http.get('data.json');
}]);
