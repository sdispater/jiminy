// Shows
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

// Settings
Meteor.publish('profiles', function() {
    return Profiles.find();
});


// Notifications
Meteor.publish('notifications', function() {
    return Notifications.find({}, {sort: {created_at: -1}});
})

Meteor.publish('latestNotifications', function() {
    return Notifications.find({}, {sort: {created_at: -1}, limit: 5});
})

// Jobs
Meteor.publish('jobs', function() {
    return Jobs.find();
})


// Files
Meteor.publish('images', function() {
    return Images.find();
});


// Logs
Meteor.publish('logs', function() {
    return Logs.find({}, {sort: {created_at: -1}});
});


// Paths
Meteor.publish('paths', function() {
    return Paths.find();
});

// Indexers
Meteor.publish('indexers', function(){
    return Indexers.find()
});

// Downloaders
Meteor.publish('downloaders', function() {
    return Downloaders.find();
});
