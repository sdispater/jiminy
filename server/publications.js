Meteor.publish('shows', function() {
    return Shows.find()
});

Meteor.publish('notifications', function() {
    return Notifications.find({seen: false});
})

