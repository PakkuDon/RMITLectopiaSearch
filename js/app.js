var app = angular.module('LectopiaSearch', ['ngRoute']);
// Route configuration
app.config(function($routeProvider) {
    $routeProvider
    .when('/', {
        controller: 'SearchController as search',
        templateUrl: 'js/views/search.html'
    })
    .when('/course/:id', {
        controller: 'CourseController as course',
        templateUrl: 'js/views/course.html'
    })
    .otherwise({
        redirectTo: '/'
    });
});
/* Custom filter for timestamps. Returns the difference between 
 * input value and current time.
 */
app.filter('relativeDate', function() {
    return function(value) {
        // Return default String if input value invalid
        if (value === null) {
            return "N/A";
        }

        var date = new Date(value);
        // Get seconds passed since input date
        var diff = (new Date() - date) / 1000;
        if (diff < 60) {
            return "A few seconds ago";
        }

        // Get minutes passed since input date
        diff = diff / 60;
        if (diff < 60) {
            return Math.floor(diff) + " "
                + (Math.floor(diff) == 1 ? "minute" : "minute") + " ago";
        }

        // Get hours passed since input date
        diff = diff / 60;
        if (diff < 24) {
            return Math.floor(diff) + " "
                + (Math.floor(diff) == 1 ? "hour" : "hours") + " ago";
        }

        // Get days passed since input date
        diff = diff / 24;
        if (diff < 7) {
            return Math.floor(diff) + " "
                + (Math.floor(diff) == 1 ? "day" : "days") + " ago";
        }

        // Get weeks passed since input date
        diff = diff / 7;
        if (diff < 52) {
            return Math.floor(diff) + " "
                + (Math.floor(diff) == 1 ? "week" : "weeks") + " ago";
        }

        // Get years passed since input date
        diff = diff / 52;
        return Math.floor(diff) + " "
            + (Math.floor(diff) == 1 ? "year" : "years") + " ago";
    };
});
