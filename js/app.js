var app = angular.module('LectopiaSearch', []);
// Controller responsible for search page
app.controller('IndexController', ['$http', function($http) {
    var self = this;
    this.lastUpdated = '';
    this.searchTerm = '';
    this.results = [];
    
    /* Find results matching given search string */
    this.loadResults = function() {
        $http.get('data.json')
        .success(function(data) {
            self.lastUpdated = new Date(data.DateGenerated);
            var results = [];

            // Filter courses by search string
            for (var courseID in data.Courses) {
                var course = data.Courses[courseID];
                
                // If name contains search substring, add to results
                if (self.searchTerm.length === 0 
                    || course.Name.toLowerCase()
                    .indexOf(self.searchTerm) >= 0) {
                    results.push(course);
                }
            
                // Convert timestamps on results to relative date format
                // TODO: See if this logic can be moved to the view
                var timestamp = course.LastUpdated;
                course['LastUpdated'] = timestamp !== null ?
                DateUtil.toRelativeDateString(new Date(timestamp)) : 'N/A';
            }

            // Set search results
            self.results = results;
        })
        .error(function(error) {
            return error;
        });
    };

    // Load all courses
    this.loadResults();
}]);
