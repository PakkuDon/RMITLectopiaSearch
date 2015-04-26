/* Empty function - trying to simulate static methods below */
function HtmlUtil() {}

/**
 * link() - Returns a String representing a hyperlink pointing to
 * the given URL.
 */
HtmlUtil.link = function(url, text) {
    return "<a href=\""
        + url + "\">"
        + text + "</a>";
}

/**
 * paragraph() - Returns a string containing HTML for paragraph
 * containing the following text.
 */
HtmlUtil.paragraph = function(text) {
    return "<p>" + text + "</p>";
}

/**
 * removeImages() - Strips img tags from given text.
 */
HtmlUtil.removeImages = function(text) {
    // Regex taken from the link below
    // http://stackoverflow.com/a/15217348
    var text = text.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {return "<img no_load_src=\"" +capture+ "\" />";});
    return text;
}

/**
 * list() - Returns a string containing the HTML for
 * either an ordered or underordered list containing
 * the elements in items.
 */
HtmlUtil.list = function(items, ordered) {
    // Start resulting HTML String with either an ol or ul element
    var text = (ordered === true ? "<ol>" : "<ul>");

    // Add list items
    for (var i = 0; i < items.length; i++) {
        text += "<li>" + items[i] + "</li>";
    }

    // Close list tag
    text += (ordered === true ? "</ol>" : "</ul>");
    return text;
}