var contextMenuItem = {
    "id": "add_word",
    "title": "Add to dictionary", 
    "contexts": ["selection"]
};

chrome.contextMenus.create(contextMenuItem);

chrome.contextMenus.onClicked.addListener 
(
    function(clickData) 
    {
        alert (clickData.selectionText);
    }
);
