
$(function() {
    $('#lang_user').change(function(){
        var selected_user_language_text = $('#lang_user :selected').text();
        var selected_user_language_id = $('#lang_user').val();

        chrome.storage.sync.set({"neword_user_language" : selected_user_language_id}, function() {
            show_notification("User language was changed!", "New language is " + selected_user_language_text);
        });
    });

    $('#lang_level').change(function(){
        var selected_user_language_level_text = $('#lang_level :selected').text();
        var selected_language_level_id = $('#lang_level').val();
        chrome.storage.sync.set({"neword_user_language_level" : selected_language_level_id}, function() {
            show_notification("Language level was changed!", "New language level is " + selected_user_language_level_text);
        });
    });
});