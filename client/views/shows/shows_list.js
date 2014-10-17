Template.showsList.helpers({
    shows: function() {
        return Shows.find({}, {sort: {name: 1}});
    }
})


Template.showsList.events({
    'click a.x-refresh-shows': function(e) {
        e.preventDefault();

        Meteor.call('createJob', 'refreshShows', {}, function(err) {
            notify('Updating show <strong>' + show.name + '</strong>', 'success');
        });
    }
});
