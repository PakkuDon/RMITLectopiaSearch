app.factory('recordings', ['$http', function($http) {
    var YQL_BASE = 'https://query.yahooapis.com/v1/public/yql?q=';

    // Helper object for parsing Lectopia response data
    var parser = {};
    parser.getFormats = function($recordingNode) {
        var formats = [];
        // Retrieve option elements containing format information
        var $formatNodes = $recordingNode
            .find("form[name*=Download]").find("option:gt(1)");

        // Retrieve format details from each option
        $.each($formatNodes, function() {
            var $option = $(this);
            var id = $option.attr("value").split(",")[1];
            var name = $option.html();

            formats.push({
                id: id,
                name: name
            });
        });
        return formats;
    };
    parser.getRecordings = function(data) {
        var $data = $(data.replace(/<img[^>]*/g, ''));
        var recordings = [];

        // Iterate over elements containing recording data
        var $recordingNodes = $data.find(".mainindex");
        $.each($recordingNodes, function() {
            // Fetch general recording details
            var $header = $(this).find(".sectionHeading");
            var id = $header.find("a").attr("id");
            var date = $header.find("h3").text()
                .replace(/\s+/g, " ").replace("-", "").trim();
            var duration = $header.find("td")[1].innerHTML
                .replace(/\s+/g, " ").trim();

            // Construct recording object from data
            var recording = {
                id: id,
                date: date,
                duration: duration
            };

            // Retrieve formats for current recording
            recording.formats = parser.getFormats($(this));
            recordings.push(recording);
        });
        return recordings;
    }

    return {
        getRecordings: function(url, callback) {
            // Construct YQL request
            var query = 'SELECT * FROM data.html.cssselect '
                + 'WHERE url=\'' + url + '\' '
                + 'AND css=\'.mainindex\'';
            var queryUrl = YQL_BASE
                + encodeURIComponent(query)
                + '&format=xml'
                + '&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
            // Once query completes, parse response data 
            // and pass data to callback
            return $http.get(queryUrl)
            .success(function(data) {
                callback(parser.getRecordings(data));
            });
        }
    };
}]);
