var keywords;

var storage = chrome.storage.local;

highlight = function(keywords) {
	// if (document.domain.indexOf('neogaf.com') == -1)
	// 	return;

	this.MAX_DEPTH = 100;

	this.SWATCH = ['yellow', 'blue', 'green', 'red', 'turq', 'orange', 'purple', 'pink', 'lilac', 'silver'];	//colours

	function highlightTextNode(node, word, pos, k)
	{
			if (node.parentNode.className.indexOf('highlight')==-1)
			{
				var spannode = document.createElement('span');
				spannode.className = 'highlight crayon-'+ this.SWATCH[k % 10];
				var middlebit = node.splitText(pos);
				var endbit = middlebit.splitText(word.length);
				var middleclone = middlebit.cloneNode(true);
				spannode.appendChild(middleclone);
				middlebit.parentNode.replaceChild(spannode, middlebit);	 

				//page_action icon
				chrome.extension.sendRequest({}, function(response) {});
			}
	}

	function innerHighlight(node, keywords, depth) 
	{
		var skip = 0;
		if(depth < this.MAX_DEPTH) {
			if (node.nodeType == 3) {

			for (var k = 0; k < keywords.length; k++) {
				word = keywords[k].toUpperCase();
				var pos = node.data.toUpperCase().indexOf(word);	//exact match
				if (pos >= 0) {
					highlightTextNode(node, word, pos, k);
					skip = 1;
				}
			}

			} else if (node.nodeType == 1 && node.childNodes && !/(script|style|input|textarea)/i.test(node.tagName) && node.style.display != "none") {
				for (var i = 0; i < node.childNodes.length; ++i) {
					i += innerHighlight(node.childNodes[i], keywords, depth+1);
				}
			}
		}
		return skip;
	}

	innerHighlight(document.body, keywords, 0);
};


function clearHighlight()
{
	e = document.querySelectorAll(".highlight");
	for (var i = 0;i<e.length;i++){
		document.querySelector(".highlight").outerHTML=document.querySelector(".highlight").innerHTML;
	}
}

function filterKeywords(khwordsRaw)
{
	// Trim commmas
	var khwordsRawTrimmed = khwordsRaw.replace(/(^\s*,)|(,\s*$)/g, '');
	var filteredKeywords = khwordsRawTrimmed.split(",");

	return filteredKeywords;
}

highlightHeartbeat = function() {
	var khwordsRaw = keywords;
	if (khwordsRaw) {
		var khwords = filterKeywords(khwordsRaw);
		highlight(khwords);
	}
}

document.addEventListener('DOMContentLoaded', function () {
	highlightHeartbeat();
});

//keywords changed
// chrome.extension.onMessage.addListener(
// 	function(request, sender, sendResponse) {
// 		if (request.command == "update") {
// 			clearHighlight();
// 			highlightHeartbeat();
// 			
// 			sendResponse({message: "done: "+ request.command});
// 		}
// 	}
// );

//storage changed
chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
	if (key == "keywords") {
	    var storageChange = changes[key];
		keywords = JSON.parse(storageChange.newValue);
		
		clearHighlight();
		highlightHeartbeat();
	}
  }
});

//initial load
storage.get('keywords', function(items) {
	if (items.keywords) {
		var khwordsRaw = JSON.parse(items.keywords);
		if (khwordsRaw) {
			var khwords = filterKeywords(khwordsRaw);
			highlight(khwords);
		}
	}
});
