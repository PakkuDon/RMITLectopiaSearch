/**
 * showPage() - Callback method. Switches current page to page
 * denoted by pageId
 * params
 * pageId: Name of the selected page.
 */
showPage = function(pageId) {
    var $selected = $("span[id=" + pageId +"]");

    // Highlight selected page button
    $(".button.selected").removeClass("selected");
    $selected.addClass("selected");

    // Hide other pages
    $("div[class^=page]").hide();
    // Display selected page
    $("." + pageId).show();

    // Collapse page links
    $("span[id^=page]").hide();

    // Show selected page button and adjacent buttons
    var index = $("span[id^=page]").index($selected);
    for (var i = index - 2; i <= index + 2; i++) {
        $("span[id^=page]:eq(" + i + ")").show();

    }

    // Show buttons at end points
    $("span[id^=page]:lt(3)").show();
    $("span[id^=page]").slice(-3).show();
}

/**
 * Helper class - generates HTML to display elements of an array
 * in a paged format.
 */
function Pager() {
    /**
     * createPagedList() - Constructs a HTML string containing divs for
     * each page and a set of links to navigate between pages.
     * params
     * elements: An array of items that will make up the page body.
     * header: Content that is displayed at the top of each page.
     * footer: Content that is displayed at the end of each page.
     * pageSize: Number of elements to display in each page.
     */
    this.createPagedList = function(elements, header, footer, pageSize) {
        var pageCount = Math.ceil(elements.length / pageSize);
        var links = this.createPageLinks(pageCount);
        var pages = this.createPages(elements, header, footer, pageSize);

        return links + pages;
    }

    /**
     * createPages() - Constructs a HTML string containing the given elements
     * spread over separate 'page' divs.
     * params
     * elements: An array of items that will make up the page body.
     * header: Content that is displayed at the top of each page.
     * footer: Content that is displayed at the end of each page.
     * pageSize: Number of elements to display in each page.
     */
    this.createPages = function(elements, header, footer, pageSize) {
        var text = "";
        var pageCount = Math.ceil(elements.length / pageSize);
        var initialElementCount = elements.length;

        for (var i = 0; i < pageCount; i++) {
            // Fetch next page's content
            var pageContent = elements.splice(0, pageSize).join("");

            // Calculate end-points
            var startIndex = i * pageSize + 1;
            var endIndex = startIndex - 1 + pageSize;
            if (endIndex > initialElementCount) {

                endIndex = initialElementCount;
            }

            // Generate String containing current page details
            var datasetString = "<p>"
                + "Displaying " + startIndex
                + " to " + endIndex
                + " of " + initialElementCount + " items."
                + "</p>";

            // Append new page to result
            text += "<div class=\"page" +  (i + 1) + "\">"
                + datasetString
                + header
                + pageContent
                + footer
                + "</div>";
        }

        return text;
    }

    /**
     * createPageLinks() - Constructs a HTML string containing links
     * to navigate between pages.
     * params
     * pageCount: Number of pages in collection.
     */
    this.createPageLinks = function(pageCount) {
        var text = "<div>";
        for (var i = 0; i < pageCount; i++) {
            var pageNum = i + 1;

            // Wrap each page number in a span element
            text += "<span class=\"button\" id=\"page"
                + pageNum
                + "\">"
                + pageNum
                + "</span>";
        }
        text += "</div>";
        return text;
    }
}

// Switch pages whenever any of the page buttons are clicked
$("body").on("click", "div > .button", function(event) {
    var pageId = $(this).attr("id");
    showPage(pageId);
});
