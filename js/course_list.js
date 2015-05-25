var CourseList = {
    data : null,
    load : function(data) {
        this.data = data;
    },
    find : function(id) {
        return this.data.Courses[id];
    },
    findCourses : function(searchTerm) {
        var results = [];

        // Add courses containing given substring to results
        for (var key in this.data.Courses) {
            var course = this.data.Courses[key];
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
