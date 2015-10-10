var app = angular.module('LectopiaSearch', ['ngRoute']);
// Route configuration
app.config(function($routeProvider) {
    $routeProvider
    .when('/', {
        controller: 'SearchController as search',
        templateUrl: 'js/views/search.html'
    });
});
