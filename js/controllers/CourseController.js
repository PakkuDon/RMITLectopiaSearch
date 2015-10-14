app.controller('CourseController', ['$http', '$q', '$routeParams', 'courses', function($http, $q, $routeParams, courses) {
    var self = this;
    var BASE_URL = 'https://lectopia.rmit.edu.au/lectopia/';
    var YQL_BASE = 'https://query.yahooapis.com/v1/public/yql?q=';

    this.name = '';
    this.lectopiaLink = '';
    this.recordings = [];
    this.loading = true;

    // Load recording data
    this.loading = true;
    courses.success(function(data) {
        // Retrieve data associated with selected course
        var course = data.Courses[$routeParams.id];
        if (typeof course === 'undefined') {
            self.name = 'Error: Course not found';
        }
        else {
            // Intermediate var to process results before displaying them
            var recordingData = [];

            // Fetch recording data
            $q.all(generateCallbacks(course.PageLinks, recordingData))
            .then(function() {
                // Sort recordings by date
                recordingData.sort(function(a, b) {
                    return Date.parse(a.date) - Date.parse(b.date);
                });

                self.recordings = recordingData;
                self.loading = false;
            });
            
            // Update view
            self.name = course.Name;
            self.lectopiaLink = BASE_URL + course.PageLinks[0];
        }
    })
    .error(function(error) {
        return error;
    });

    /** 
     * Return array of AJAX calls for each link 
     * contained in links.
     */
    function generateCallbacks(links, recordings) {
        var callbacks = [];
        
        // Construct $http calls to given links
        for (var i = 0; i < links.length; i++) {
            // Using YQL for cross-domain access
            var query = 'SELECT * FROM data.html.cssselect '
                + 'WHERE url=\'' + BASE_URL + links[i] + '\' '
                + 'AND css=\'.mainindex\'';
            var queryUrl = YQL_BASE
                + encodeURIComponent(query)
                + '&format=xml'
                + '&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';

            callbacks.push($http.get(queryUrl)
            .success(function(data) {
                // Remove image elements from response data
                data = data.replace(/<img[^>]*>/g, "");
                // Parse response and add recordings to given array
                var parser = new LectopiaParser();
                parser.load(data);
                var retrievedRecordings = parser.getRecordings();
                Array.prototype.push.apply(recordings, retrievedRecordings);
            }));
        }
        return callbacks;
    }
}]);
