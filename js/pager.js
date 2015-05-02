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

    /**
     * showPage() - Callback method. Switches current page to page
     * denoted by pageId
     * params
     * pageId: Name of the selected page.
     */
    this.showPage = function(pageId) {
        // Hide other pages
        $("div[class^=page]").hide();
        // Display associated page
        $("." + pageId).show();
    }
}
