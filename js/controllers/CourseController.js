app.controller('CourseController', 
['$q', '$http', '$routeParams', 'courses', 'recordings', 
function($q, $http, $routeParams, courses, recordings) {
    var self = this;
    var BASE_URL = 'https://lectopia.rmit.edu.au/lectopia/';
    var DOWNLOAD_URL = BASE_URL + 'downloadpage.lasso?fid=';
    var YQL_BASE = 'https://query.yahooapis.com/v1/public/yql?q=';

    this.name = '';
    this.lectopiaLink = '';
    this.recordings = [];
    this.loading = true;

    this.failedReads = {};

    // Load recording data
    this.loading = true;
    courses.success(function(data) {
        // Retrieve data associated with selected course
        var course = data.courses[$routeParams.id];
        if (typeof course === 'undefined') {
            self.name = 'Error: Course not found';
        }
        else {
            // Intermediate var to process results before displaying them
            var recordingData = [];

            // Fetch recording data
            $q.all(getRecordingData(course.pageLinks, recordingData))
            .then(function() {
                // Fetch download links for recordings
                $q.all(getDownloadLinks(recordingData)).then(function() {
                    self.recordings = recordingData;
                    self.loading = false;    
                });
            });
            
            // Update view
            self.name = course.name;
            self.lectopiaLink = BASE_URL + course.pageLinks[0];
        }
    })
    .error(function(error) {
        return error;
    });

    /** 
     * Return array of AJAX calls for each link 
     * contained in links.
     */
    function getRecordingData(links, sessions) {
        var callbacks = [];
        
        // Construct $http calls to given links
        for (var i = 0; i < links.length; i++) {
            callbacks.push(
                recordings.getRecordings(BASE_URL + links[i], 
                function(retrievedRecordings) {
                    Array.prototype.push.apply(sessions, retrievedRecordings);
                },
                // If query times out, retain URL for later re-read
                // Initialise 'loading' flag to false
                function(url) {
                    self.failedReads[url] = false;
                }
            ));
        }
        return callbacks;
    }
    
    /**
     * Return array of asynchronous calls to individual recording files
     */
    function getDownloadLinks(recordingData) {
        var requests = [];
        
        for (var i = 0; i < recordingData.length; i++) {
            var recording = recordingData[i];
            for (var j = 0; j < recording.formats.length; j++) {
                var format = recording.formats[j];
                var query = 'SELECT * FROM html '
                    + 'WHERE url=\'' + DOWNLOAD_URL + format.id + '\' ';
                var queryUrl = YQL_BASE
                    + encodeURIComponent(query)
                    + '&format=xml';
                // Retrieve download link for given recording format
                (function(format) {
                    requests.push($http.get(queryUrl)
                        .success(function(data) {
                            var $data = $(data.replace(/<img[^>]*/g, ''));
                            format.download_url = $data.find('a')[0].href;
                        })
                        .error(function(err) {
                            // TODO: Error handling
                        })
                )})(format);
            }
        }
        
        return requests;
    }

    this.readUrl = function(url) {
        // Show loading spinner for associated entry
        self.failedReads[url] = true;

        // Attempt to read from URL that previously failed to load
        recordings.getRecordings(url, 
        function(recordings) {
            // On success, add retrieved recordings to model
            // and removed entry from fail reads
            Array.prototype.push.apply(self.recordings, recordings);
            delete self.failedReads[url];
        },
        function(url) {
            // Reset flag
            self.failedReads[url] = false;
        });
    }
}]);
