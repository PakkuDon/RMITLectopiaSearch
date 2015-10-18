// Controller responsible for search page
app.controller('SearchController', ['$scope', 'courses', 
    function($scope, courses) {
    var self = this;
    this.lastUpdated = '';
    this.searchTerm = '';
    this.results = [];
    this.loading = false;

    // Paging fields
    this.currentPage;
    this.pageCount;
    this.startPos;
    this.endPos;
    this.pageSizes = [
        25, 50, 75, 100, 150, 200
    ];
    this.pageSize = this.pageSizes[0];
    
    /* Find results matching given search string */
    this.loadResults = function() {
        self.loading = true;
        courses.success(function(data) {
            self.loading = false;
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
            }

            // Set search results and page vars
            self.results = results;
            self.setPage(1);
        })
        .error(function(error) {
            return error;
        });
    };

    /* Set visible records */
    this.setPage = function(pageNo) {
        self.currentPage = pageNo;
        self.pageCount = Math.ceil(self.results.length / self.pageSize);
        self.startPos = (pageNo - 1) * self.pageSize;
        self.endPos = self.startPos + self.pageSize;

        // Constrain values of start and end points
        if (self.results.length === 0) {
            // Set to -1 since positions are zero-indexed
            // View will add 1 to displayed value
            self.startPos = -1;
        }
        if (self.endPos > self.results.length) {
            self.endPos = self.results.length;
        }
    }

    /* Set page size */
    this.setPageSize = function(size) {
        self.pageSize = size;

        // Redisplay pages
        self.setPage(1);
    }

    /* Return array of given size
     * Helper function for generating page links */
    $scope.getNumber = function(max) {
        return new Array(max);
    }

    // Initialise results
    this.loadResults();
}]);
