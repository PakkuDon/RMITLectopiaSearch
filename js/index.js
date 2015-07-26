var PAGE_SIZE = 75;
var pager = new Pager();
var courseList = new CourseList();

function showCourses(searchTerm) {
    // Clear results from previous run
    $("#results").empty();

    // Filter courses by given search term
    var results = courseList.findCourses(searchTerm);

    // Convert course data to table rows for paging
    var rows = results.map(function(course) {
        // Format timestamp
        var timestamp = course.LastUpdated !== null ?
            DateUtil.toRelativeDateString(new Date(course.LastUpdated))
            : "N/A";

        // Wrap course data in a table row element
        return "<tr>"
            + "<td>"
            + HtmlUtil.link("recordings.html?id="
                            + course.ID, course.Name)
            + "</td>"
            + "<td>" + timestamp + "</td>"
            + "</tr>";

    });

    var header = "<table>"
        + "<thead>"
        + "<th>Name</th>"
        + "<th>Last Updated</th>"
        + "</thead>"
        + "<tbody>";
    var footer = "</tbody>"
        + "</table>"
        + "</div>";

    // Generate HTML to display results in a paged tabular format
    var pages = pager.createPagedList(rows, header, footer, PAGE_SIZE);

    // Add generated HTML to page
    $("#results").append(pages);

    // Hide all other pages except for the first
    pager.showPage("page1");
}

$(document).ready(function() {
    // Load course data and
    // display full list of courses
    $("#status").html("Fetching data...");
    courseList.load(function(data) {
        var lastUpdated = new Date(data.DateGenerated);
        var statusText = "Data last updated: "
            + DateUtil.toLongDateString(lastUpdated)
            + " (" + DateUtil.toRelativeDateString(lastUpdated) + ")";

        $("#status").html(statusText);
        showCourses();
    });

    // Register search form's submit action
    $("#searchForm").submit(function() {
        var searchTerm = $("#searchTerm").val().toLowerCase();
        showCourses(searchTerm);
    });

    // Switch pages whenever any of the page buttons are clicked
    $("body").on("click", "div > .button", function(event) {
        var pageId = $(this).attr("id");
        pager.showPage(pageId);
    });
});