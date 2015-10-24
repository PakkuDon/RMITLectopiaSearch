app.controller('CourseController', ['$q', '$routeParams', 
'courses', 'recordings', function($q, $routeParams, courses, recordings) {
    var self = this;
    var BASE_URL = 'https://lectopia.rmit.edu.au/lectopia/';
    var YQL_BASE = 'https://query.yahooapis.com/v1/public/yql?q=';

    this.name = '';
    this.lectopiaLink = '';
    this.recordings = [];
    this.loading = true;

    this.failedReads = [];

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
    function generateCallbacks(links, sessions) {
        var callbacks = [];
        
        // Construct $http calls to given links
        for (var i = 0; i < links.length; i++) {
            callbacks.push(
                recordings.getRecordings(BASE_URL + links[i], 
                function(retrievedRecordings) {
                    Array.prototype.push.apply(sessions, retrievedRecordings);
                },
                function(url) {
                    self.failedReads.push({
                        url: url,
                        loading: false
                    });
                }
            ));
        }
        return callbacks;
    }

    this.readUrl = function(index) {
        self.failedReads[index].loading = true;

        // Attempt to read from URL that previously failed to load
        recordings.getRecordings(self.failedReads[index].url, 
        function(recordings) {
            // On success, add retrieved recordings to model
            // and removed entry from fail reads
            Array.prototype.push.apply(self.recordings, recordings);
            self.failedReads.splice(index, 1);
        },
        function(url) {
            // Reset flag
            self.failedReads[index].loading = false;
        });
    }
}]);
