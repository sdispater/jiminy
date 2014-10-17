Template.logsList.helpers({
});


Template.logsList.events({
    'click a.x-clear-logs': function(e) {
        e.preventDefault();

        Meteor.call('clearLogs');
    }
});
