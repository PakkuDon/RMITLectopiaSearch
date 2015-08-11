// Constants - commonly used Strings
var BASE_URL = "https://lectopia.rmit.edu.au/lectopia/";
var CASTER_URL = BASE_URL + "casterframe.lasso?fid=";

var pager = new Pager();
var courseList = new CourseList();

// Prototype for recording objects
function Recording(id, date, duration) {
    this.id = id;
    this.date = date;
    this.duration = duration;
    this.formats = [];
}

// Prototype for recording formats
function Format(id, name) {
    this.id = id;
    this.name = name;
}

/**
 * Returns a hash containing GET parameters
 * and their associated values.
 */
function retrieveParams() {
    var request = window.location.search.substring(1);
    var params = request.split("&");
    var args = {};
    for (var i = 0; i < params.length; i++) {
        var pair = params[i].split("=");
        args[pair[0]] = pair[1];
    }

    return args;
}

/**
 * Returns an array of AJAX calls for each
 * link contained in links.
 * Callbacks append new recordings to recordings array.
 */
function generateCallbacks(links, recordings) {
    var callbacks = [];

    for (var i = 0; i < links.length; i++) {
        var link = BASE_URL + links[i];

        callbacks.push($.ajax({
            url: link,
            type: "GET",
            success: function(result) {
                // Sanitize response string and parse response
                var data = HtmlUtil.removeImages(result.responseText);
                var parser = new LectopiaParser();
                parser.load(data);

                // Add retrieved recordings to collection
                var retrievedRecordings = parser.getRecordings();
                recordings.push.apply(recordings, retrievedRecordings);
            }
        }));
    }

    return callbacks;
}

/**
 * Generate and append HTML content containing recording details.
 */
function displayRecordings(recordings) {
    // Create HTML elements to store recording details
    var content = "";
    // If no recordings found, add message
    if (recordings.length === 0) {
        content += HtmlUtil.paragraph("No recordings found.");
    }
    else {
        var recordingElements = [];
        for (var i = 0; i < recordings.length; i++) {
            var recording = recordings[i];

            // Write general recording / session details
            var details = "<div class=\"details\">"
                + HtmlUtil.paragraph("Date recorded: " + recording.date)
                + HtmlUtil.paragraph("Duration: " + recording.duration)
                + "</div>";

            // List available file types for current recording
            var formatList = "";
            if (recording.formats.length === 0) {
                formatList += HtmlUtil.paragraph("No formats available");
            }
            else {
                formatList += HtmlUtil.paragraph("Available formats:");

                var formatLinks = [];
                for (var j = 0; j < recording.formats.length; j++) {
                    var format = recording.formats[j];
                    formatLinks.push(HtmlUtil.link(
                        CASTER_URL + format.id, format.name));
                }

                formatList += HtmlUtil.list(formatLinks, false);
            }

            // Create container for recording formats
            var formats = "<div class=\"formats\">"
                + formatList
                + "</div>";

            // Append recording details to result
            recordingElements.push("<div class=\"recording\">"
                + details
                + formats
                + "</div>");
        }

        // Paginate recordings and add recording pages to page
        content = pager.createPagedList(recordingElements, "", "", 10);
    }

    // Display results
    $("#results").append(content);

    // Hide all other pages except for the first
    showPage("page1");
}

$(document).ready(function() {
    // Retrieve GET parameters
    var args = retrieveParams();

    // If ID not supplied, return to index
    if (typeof args["id"] === "undefined") {
        window.location.replace("index.html");
    }
    // Else, retrieve associated course's details
    else {
        courseList.load(function(data) {
            var course = courseList.find(args["id"]);

            // If course not found, show error
            if (typeof course === "undefined") {
                $("#status").html("Error: Course not found.");
            }
            // Else, display information and retrieve recordings
            else {
                $("#courseName").html(course.Name);
                var pageLinks = course.PageLinks;
                $("#lectopiaLink").attr("href", BASE_URL + pageLinks[0]);
                var recordings = [];

                // Parse documents at page links
                // Display recording details when all AJAX calls have been completed
                $.when.apply($, generateCallbacks(pageLinks, recordings)).done(function() {
                    // Remove loading message
                    $("#status").remove();

                    // Sort recordings by date in ascending order
                    recordings.sort(function(a, b) {
                        return Date.parse(a.date) - Date.parse(b.date);
                    });

                    displayRecordings(recordings);
                });
            }
        });
    }
});
