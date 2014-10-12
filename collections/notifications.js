Notifications = new Meteor.Collection('notifications');


Meteor.methods({
    notify: function(message, type, description, url) {
        var options = {
            message: message,
            type: type || 'info',
            seen: false,
            created_at: new Date().getTime()
        };

        if (description != undefined && description != null) {
            options['description'] = description;
        }

        if (url != undefined && url != null) {
            options['url'] = url;
        }

        Notifications.insert(options);
    },
    notifyError: function(error) {
        Notifications.insert({
            message: error.message,
            type: 'error',
            seen: false,
            created_at: new Date().getTime()
        });
    }
});


Notifications.allow({
    remove: function() {
        return true;
    },
    update: function() {
        return true;
    }
})
