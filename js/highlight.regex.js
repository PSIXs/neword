var keywords;
var highlighted = false;

var storage = chrome.storage.local;

var $highlight = jQuery.noConflict();

highlight = function(keywords) {
	// if (document.domain.indexOf('neogaf.com') == -1)
	// 	return;

	for (var i = 0; i < keywords.length; i++) {
		keywords[i] = '('+keywords[i]+')';
	}
	words = keywords.join('|');

	var re = new RegExp(words,'i');
	var start = new Date().getTime();
	// console.log("HIGHLIGHT");
	$highlight('body').highlightRegex(re, {
		tagType:   'span',
		className: 'highlighter',
		palette:   ['yellow', 'blue', 'green', 'red', 'turq', 'orange', 'purple', 'pink', 'lilac', 'silver']	//colours
	});
	// console.log("REMOVE EXTRAS");
	$highlight(':input,:text').highlightRegex({
		tagType:   'span',
		className: 'highlighter'
	});
	var ended = new Date().getTime();
	console.log("highlighter: "+ (ended-start) +"ms");

	//page_action icon
	chrome.extension.sendRequest({}, function(response) {});
}

function clearHighlight() {
	// console.log("CLEAR HIGHLIGHT");
	$highlight('body').highlightRegex({
		tagType:   'span',
		className: 'highlighter'
	});
}

function filterKeywords(khwordsRaw) {
	// Trim commmas
	var khwordsRawTrimmed = khwordsRaw.replace(/(^\s*,)|(,\s*$)/g, '');
	var filteredKeywords = khwordsRawTrimmed.split(",");

	return filteredKeywords;
}

highlightHeartbeat = function() {
	// console.log("heartbeat");
	var khwordsRaw = keywords;
	if (khwordsRaw) {
		var khwords = filterKeywords(khwordsRaw);
		highlight(khwords);
	}
}

// document.addEventListener('DOMContentLoaded', function () {
// 	console.log("loaded");
// 	highlightHeartbeat();
// });

//unhighlight & rehighlight
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.command == "unhighlight") {
			// console.log("unhighlight");
			clearHighlight();
		} else if (request.command == "rehighlight") {
			// console.log("load");
			loadKeywords();
		} else if (request.command == "rehighlightall") {
			// console.log("rehighlightall");
			clearHighlight();
			loadKeywords();
		}
		sendResponse({message: "done"});
	}
);

//storage changed
chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
	if (key == "keywords") {
	    var storageChange = changes[key];
		keywords = JSON.parse(storageChange.newValue);
		
		// console.log("store changed");
		clearHighlight();
		highlightHeartbeat();
	}
  }
});

//initial load
function loadKeywords() {
	storage.get('keywords', function(items) {
		if (items.keywords) {
			var khwordsRaw = JSON.parse(items.keywords);
			if (khwordsRaw) {
				var khwords = filterKeywords(khwordsRaw);
				// console.log("loadKeywords");
				highlight(khwords);
			}
		}
	});
}

// loadKeywords();