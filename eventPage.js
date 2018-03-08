chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.todo == "doYourJob") {
        //console.log(request.content);

        //chrome.tabs.query({active:true, currentWindow: true}, function(tabs) {
          //  chrome.pageAction.show(tabs[0].id);
        //});        

    }
});
