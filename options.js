$(function () {
    $('#lang_user').change(function () {
        var selected_user_language_text = $('#lang_user :selected').text();
        var selected_user_language_id = $('#lang_user').val();

        chrome.storage.sync.set({ "neword_user_language": selected_user_language_id }, function () {
            show_notification("User language was changed!", "New language is " + selected_user_language_text);
        });
    });

    $('#lang_level').change(function () {
        var selected_user_language_level_text = $('#lang_level :selected').text();
        var selected_language_level_id = $('#lang_level').val();
        chrome.storage.sync.set({ "neword_user_language_level": selected_language_level_id }, function () {
            show_notification("Language level was changed!", "New language level is " + selected_user_language_level_text);
        });
    });
    $('#add_words').click(function () {
        if (this.id == 'add_words') {
            var selected_new_words = $('#new_words').val();
            chrome.storage.sync.set({ "neword_user_new_words": selected_new_words }, function () {
                addWordsToDict(selected_new_words)
            });
        }
        location.reload();
    });
    $('#remove_words').click(function () {
        var table_words = document.getElementById('dict_tbl');
        var arrayWords = [];
        $('input:checkbox:checked', table_words).each(function () {
            arrayWords.push($(this).closest('tr').find('td:first').text());
        }).get();
        removeWordsFromDict(arrayWords);
    });
    chrome.storage.sync.get(["neword_user_dictionary"], function (data) {
        $('#current_dictionary').text(data.neword_user_dictionary);
        var words = data.neword_user_dictionary;
        var td = "<td>", tdc = "</td>";
        for (var i = 0; i < words.length; i++) {
            $('#dict_tbl').append("<tr>" +
                td + words[i] + tdc +
                td + "<input type=\"checkbox\"/>" + tdc
                + "</tr>");
        }
    });
});