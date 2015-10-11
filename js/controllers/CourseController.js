app.controller('CourseController', ['$http', '$q', '$routeParams', 
function($http, $q, $routeParams) {
    var self = this;
    var BASE_URL = "https://lectopia.rmit.edu.au/lectopia/";

    this.name = '';
    this.lectopiaLink = '';
    this.recordings = [];
    this.loading = true;

    // Load recording data
    this.loading = true;
    $http.get('data.json')
    .success(function(data) {
        // Retrieve data associated with selected course
        var course = data.Courses[$routeParams.id];
        if (typeof course === 'undefined') {
            // TODO: Error handling
            self.name = 'Error: Course not found';
        }
        else {
            // Update view
            self.name = course.Name;
            self.lectopiaLink = BASE_URL + course.PageLinks[0];
        }

        self.loading = false;
    })
    .error(function(error) {
        return error;
    });
}]);
