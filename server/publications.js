Meteor.publish('shows', function() {
    return Shows.find()
});

Meteor.publish('notifications', function() {
    return Notifications.find({}, {sort: {created_at: -1}});
})

Meteor.publish('latestNotifications', function() {
    return Notifications.find({}, {sort: {created_at: -1}, limit: 5});
})

