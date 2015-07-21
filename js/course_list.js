/**
 * Responsible for loading and retrieving course data.
 */
function CourseList() {
    var self = this;
    this.data = null;
    // Load data from data source
    this.load = function(callback) {
        $.ajax({
            url: "data.json",
            dataType: "json",
            method: "GET"
        }).done(function(data) {
            self.data = data;
            if (typeof callback !== "undefined") {
                callback(data);
            }
        });
    }
    // Retrieve course with the given ID
    this.find = function(id) {
        return this.data.Courses[id];
    }
    // Find courses containing a specific substring
    this.findCourses = function(searchTerm) {
        var results = [];

        // Add courses containing given substring to results
        for (var key in self.data.Courses) {
            var course = self.data.Courses[key];
            if (typeof searchTerm === "undefined"
                || (course["Name"].toLowerCase().indexOf(searchTerm) >= 0)) {
                results.push(course);
            }
        }

        // Sort courses by name (case-insensitive)
        results.sort(function(a, b) {
            var nameA = a.Name.toLowerCase();
            var nameB = b.Name.toLowerCase();

            if (nameA === nameB) {
                return 0;
            }
            else {
                return (nameA > nameB) ? 1 : -1;
            }
        });

        return results;
    }
};
