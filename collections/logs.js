Logs = new Meteor.Collection('logs');

Meteor.methods({
    log: function(category, type, description) {
        var options = {
            category: category,
            type: type || 'info',
            created_at: new Date().getTime(),
            description: description
        };

        var message = '[' + category + '] ' + description;
        if (type == 'info') {
            console.log(message.blue);
        } else if (type == 'warning') {
            console.log(message.yellow);
        } else if (type == 'error') {
            console.log(message.red);
        } else if (type == 'success') {
            console.log(message.green);
        }

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
