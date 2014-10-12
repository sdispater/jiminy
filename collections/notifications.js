Notifications = new Meteor.Collection('notifications');


Meteor.methods({
    notify: function(message, type) {
        Notifications.insert({
            message: message,
            type: type || 'info',
            seen: false,
            created_at: new Date().getTime()
        });
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
