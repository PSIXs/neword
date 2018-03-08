    function show_notification(title, msg) {
        var notifOptions = {
            type: 'basic',
            iconUrl: 'icon48.png',
            title: title,
            message: msg    
        };
        chrome.notifications.create('limitNotif', notifOptions);
    }
