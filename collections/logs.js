Logs = new Meteor.Collection('logs');

Meteor.methods({
    log: function(category, type, description) {
        var options = {
            category: category,
            type: type || 'info',
            created_at: new Date().getTime(),
            description: description
        };

        Logs.insert(options);
    },
    logError: function(category, error) {
        var options = {
            category: category,
            type: 'error',
            created_at: new Date().getTime(),
            description: error.message
        };

        Logs.insert(options);
    },
    clearLogs: function() {
        Logs.remove({});
    }
});


Logs.allow({
    remove: function () {
        return true
    }
});
