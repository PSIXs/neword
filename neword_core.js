// Popup Notification
function show_notification(title, msg) {
    var notifOptions = {
        type: 'basic',
        iconUrl: 'icon48.png',
        title: title,
        message: msg    
    };
    chrome.notifications.create('limitNotif', notifOptions);
}

// Check if word is valid English word
function checkValidity(word) {
    return true;
}

// Check if word exists in dict
function checkExistence(word, dict) {
    return false;
}


function addNewWords(words, dict) {
    return dict;
}

// 
function getData(data_name, func) {
    chrome.storage.sync.get([data_name], function(data) {
        func(data[data_name]);
    });
}

// Add word to Dictionary storage 
function addWordsToDict(words) 
{

    if (checkValidity(words) == false) {
        show_notification("Some words are not valid", "Please check and verify if words are an English word");
        return false;
    }
    getData('neword_dictionary', function(current_dictionary){
        
    });

    chrome.storage.sync.get(['neword_dictionary'], function (data){
        var current_dictionary = [];
        if (data.neword_dictionary) {
            current_dictionary = data.neword_dictionary;
        }
        current_dictionary = addNewWords (words, current_dictionary);
        chrome.storage.sync.set({'neword_dictionary': current_dictionary}, function(){});
    });
    
    show_notification("Words have been successfully added", words);
    return true;
}

// synchronous function



