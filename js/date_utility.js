/**
 * Responsible for formatting JS Date objects to the different formats
 * used in this application.
 */
var DateUtil = {
    // Example output: 20/7/2015 01:19:40
    toShortDateString : function(date) {
        return date.getDate() + "/"
            + (date.getMonth() + 1) + "/"
            + date.getFullYear() + " "
            + this.formatTime(date);

    },
    // Example output: Mon Jul 20 2015 01:19:40 AM
    toLongDateString : function(date) {
        return date.toDateString() + " "
            + this.formatTime(date, true);
    },
    /* Returns a String displaying the difference between current
     * date/time and given date time.
     * Example output:
         seconds ago
         x minutes ago
         x hours ago
         x days ago
         x weeks ago
         x years ago
     */
    toRelativeDateString : function(date) {
        // Get seconds passed since date
        var diff = (new Date() - date) / 1000;
        if (diff < 60) {
            return "A few seconds ago";
        }

        // Get minutes passed since date
        diff = diff / 60;
        if (diff < 60) {
            return Math.floor(diff) + " "
                + (Math.floor(diff) == 1 ? "minute" : "minute") + " ago";
        }

        // Get hours passed since date
        diff = diff / 60;
        if (diff < 24) {
            return Math.floor(diff) + " "
                + (Math.floor(diff) == 1 ? "hour" : "hours") + " ago";
        }

        // Get days passed since date
        diff = diff / 24;
        if (diff < 7) {
            return Math.floor(diff) + " "
                + (Math.floor(diff) == 1 ? "day" : "days") + " ago";
        }

        // Get weeks passed since date
        diff = diff / 7;
        if (diff < 52) {
            return Math.floor(diff) + " "
                + (Math.floor(diff) == 1 ? "week" : "weeks") + " ago";
        }

        // Get years passed since date
        diff = diff / 52;
        return Math.floor(diff) + " "
            + (Math.floor(diff) == 1 ? "year" : "years") + " ago";
    },
    /* Returns time value in some format.
     * Example output:
     * 01:19:40 PM - is12Hour equal to true
     * 13:19:40 - 24 hour display
     */
    formatTime : function(date, is12Hour) {
        var timeString = "";
        // Append hours segment. Wrap value if 12-hour display used
        if (is12Hour === true && date.getHours() > 12) {
            timeString += this.padLeft(date.getHours() % 12);
        }
        else {
            timeString += this.padLeft(date.getHours());
        }

        // Append minutes
        timeString += ":" + this.padLeft(date.getMinutes());

        // Append seconds
        timeString += ":" + this.padLeft(date.getSeconds());

        // Append AM/PM sign if 12-hour display used
        if (is12Hour === true) {
            if (date.getHours() < 12) {
                timeString += " AM";
            }
            else {
                timeString += " PM";
            }
        }

        return timeString;
    },
    // Adds a single preceding 0 to a value. Used to format timestamps.
    padLeft : function(value) {
        if (value < 10) {
            return "0" + value;
        }
        return value;
    }
};
