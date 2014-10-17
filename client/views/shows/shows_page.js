Template.showsPage.helpers({
    posterUrl: function() {
        try {
            return Images.findOne({_id: this.images.poster}).url();
        } catch (err) {
            console.log(err);
        }
    },
    seasons: function() {
        return Seasons.find({show_id: this._id}, {sort: {number: -1}});
    },
    ended: function() {
        return this.status == 'Ended';
    },
    profile: function() {
        return Profiles.findOne(this.profile_id);
    }
});

Template.showsPage.events({
    'click a.x-update-show': function(e) {
        e.preventDefault();

        var showId = $(e.target).data('show-id');
        var show = Shows.findOne(showId);

        Meteor.call('createJob', 'updateShow', {show_id: showId}, function(err) {
            Meteor.call('notify', 'Updating show <strong>' + show.name + '</strong>', 'success');
        });
    }
});
