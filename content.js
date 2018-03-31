var whole_page = document.body.innerHTML;
var current_user_dictionary = [];
var current_user_language = "russian";
var current_user_language_level = "beginner";
var word_state = ['new', 'failed', 'success'];
var word_state_color = ['yellow', 'yed', 'green'];

function word_processor (dictionary_item) {
    whole_page = whole_page.replace(new RegExp(dictionary_item, 'g'), '<mark style="background-color: lightgreen">' + dictionary_item + "</mark>");
}                       

chrome.storage.sync.get(['neword_user_dictionary', 'neword_user_language_level', 'neword_user_language'], function(data) {
    if (data.neword_user_dictionary)
        current_user_dictionary = data.neword_user_dictionary;
    if (data.neword_user_language)
        current_user_language = data.neword_user_language;
    if(data.neword_user_language_level)
        current_user_language_level = data.neword_user_language_level;

    for (var index in current_user_dictionary) {
        word_processor(current_user_dictionary[index]);
    }
    
    document.body.innerHTML = whole_page;
});

