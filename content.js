function keywordsHighlighter(options, remove) {
	var occurrences = 0;

	// Based on "highlight: JavaScript text higlighting jQuery plugin" by Johann Burkard.
	// http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html
	// MIT license.
	function highlight(node, pos, keyword, options) {
		var span = document.createElement("span");
		span.className = "highlighted";
		span.style.color = options.foreground;
		span.style.backgroundColor = options.background;

		var highlighted = node.splitText(pos);
		/*var afterHighlighted = */highlighted.splitText(keyword.length);
		var highlightedClone = highlighted.cloneNode(true);

		span.appendChild(highlightedClone);
		highlighted.parentNode.replaceChild(span, highlighted);

		occurrences++;
	}

	function addHighlights(node, keywords, options) {
		var skip = 0;

		var i;
		if (3 == node.nodeType) {
			for (i = 0; i < keywords.length; i++) {
				var keyword = keywords[i].toLowerCase();
				var pos = node.data.toLowerCase().indexOf(keyword);
				if (0 <= pos) {
					highlight(node, pos, keyword, options);
					skip = 1;
				}
			}
		}
		else if (1 == node.nodeType && !/(script|style|textarea)/i.test(node.tagName) && node.childNodes) {
			for (i = 0; i < node.childNodes.length; i++) {
				i += addHighlights(node.childNodes[i], keywords, options);
			}
        }
        
		return skip;
	}

	function removeHighlights(node) {
		var span;
		while (span = node.querySelector("span.highlighted")) {
			span.outerHTML = span.innerHTML;
		}

		occurrences = 0;
	}

	if (remove) {
		removeHighlights(document.body);
	}

	var keywords = options.keywords;
	delete options.keywords;
	addHighlights(document.body, keywords, options);
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if ("newWordAdded" == request.message) {
		if ("undefined" != typeof request.keywords && request.keywords) {
			keywordsHighlighter({
					"keywords": request.keywords,
                    "foreground": "#000000",
                    "background": "#ffff00"
				},
				false
			);
		}
	}
});


var current_user_dictionary = [];
var current_user_language = "russian";
var current_user_language_level = "beginner";
var word_state = ['new', 'failed', 'success'];
var word_state_color = ['yellow', 'yed', 'green'];


chrome.storage.sync.get(['neword_user_dictionary', 'neword_user_language_level', 'neword_user_language'], function(data) {
    if (data.neword_user_dictionary)
        current_user_dictionary = data.neword_user_dictionary;
    if (data.neword_user_language)
        current_user_language = data.neword_user_language;
    if(data.neword_user_language_level)
        current_user_language_level = data.neword_user_language_level;

    keywordsHighlighter(
        {
            "keywords": current_user_dictionary,
            "foreground": "#000000",
            "background": "#ffff00"
        },      
        true
    );      
});
