function LectopiaParser() {
    this.data = null;

    /**
     * load() - Stores response text for later use
     */
    this.load = function(text) {
        this.data = $(text);
    }

    /**
     * getRecordings() - Scrapes details of recordings stored in text
     * and converts those details to a list of recording instances.
     */
    this.getRecordings = function() {
        var recordings = [];
        var self = this;

        // Iterate over elements containing recording data;
        var $recordingNodes = this.data.find(".mainindex");
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
                duration: duration,
                formats: []
            };

            // Retrieve formats for current recording
            recording.formats = self.getFormats($(this));

            recordings.push(recording);
        });

        return recordings;
    }

    /**
     * getFormats() - Parses the given recording node and constructs
     * a list of format objects.
     */
    this.getFormats = function($recordingNode) {
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
    }
}
