var contextMenuItem = {
    "id": "ds",
    "title": "Add to dictionary", 
    "contexts": ["selection"]
};

chrome.contextMenus.create(contextMenuItem);

chrome.contextMenus.onClicked.addListener 
(
    function(clickData) 
    {
        // alert (clickData.selectionText);
        console.log ("Adding selected words to dictionary");
        addWordsToDict(clickData.selectionText);
    }
);
