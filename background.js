chrome.contextMenus.removeAll(function() {
    var contextMenuAddToDictionary = {
        "id": "neword_addtodictionary",
        "title": "Add to dictionary", 
        "contexts": ["selection"]
    };
    chrome.contextMenus.create(contextMenuAddToDictionary);

    var contextMenuTestMe = {
        "id": "neword_testme",
        "title": "Test Me", 
        "contexts": ["selection"]
    };    
    chrome.contextMenus.create(contextMenuTestMe);
});

chrome.contextMenus.onClicked.addListener 
(
    function(clickData) 
    {
        if (clickData.menuItemId == 'neword_addtodictionary') {
            console.log ("Adding selected words to dictionary");
            var words = clickData.selectionText.split(/[^A-Za-z]/);
            addWordsToDict(words);            
        }                                                   
        else if (clickData.menuItemId == 'neword_testme') {
            console.log("testing user");
            show_notification("Do you really want to be tested? " , "Really?");    
        }
    }
);
