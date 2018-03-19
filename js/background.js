//page_action icon
function onRequest(request, sender, sendResponse) {
	chrome.pageAction.show(sender.tab.id);

	chrome.contextMenus.create({
		"title": "Highlight selection",
		"contexts": ["selection"],
		"onclick" : function(e) {
			if (e.selectionText) {
				// console.log(e.selectionText);
				var storage = chrome.storage.local;

				//load
				storage.get('keywords', function(items) {
					if (items.keywords) {
						keywordList = JSON.parse(items.keywords);
						keywordList = keywordList +","+ e.selectionText;
						// console.log(keywordList);

						//save
						keywordList = JSON.stringify(keywordList);
						storage.set({'keywords': keywordList}, function() {
						});
					}
				});
			}
		}
	});

	sendResponse({});
};
chrome.extension.onRequest.addListener(onRequest);

//rehighlight on page update
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (tab.status == "complete") {
		// console.log("rehighlight");

		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.sendMessage(tab.id, {command: "rehighlightall"}, function(response) {
				// console.log(response.message);
			});
		});
	}
});

// EXTERNAL
function onMessageExternal(request, sender, sendResponse) {
	// console.log("onMessageExternal", request);
	
	// if (sender.id == blacklistedExtension)
	// 	return;  // don't allow this extension access
	// else 
	if (request.command == "isHighlighterInstalled") {
		sendResponse({message: "isHighlighterInstalled"});
	}
}
chrome.extension.onMessageExternal.addListener(onMessageExternal);
