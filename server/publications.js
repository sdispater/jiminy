Meteor.publish('shows', function() {
    return Shows.find()
});

Meteor.publish('singleShow', function(id) {
    return id && Shows.find(id);
});

Meteor.publish('showSeasons', function(id) {
    return id && Seasons.find({show_id: id});
});

Meteor.publish('showEpisodes', function(id) {
    return id && Episodes.find({show_id: id});
});

Meteor.publish('seasons', function() {
    return Seasons.find();
});

Meteor.publish('episodes', function() {
    return Episodes.find();
});

Meteor.publish('profiles', function() {
    return Profiles.find();
});

Meteor.publish('notifications', function() {
    return Notifications.find({}, {sort: {created_at: -1}});
})

Meteor.publish('latestNotifications', function() {
    return Notifications.find({}, {sort: {created_at: -1}, limit: 5});
})

// jobs
Meteor.publish('jobs', function() {
    return Jobs.find();
})

Meteor.publish('images', function() {
    return Images.find();
});
