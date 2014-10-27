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
    },
    availableProfiles: function() {
        var self = this;
        return Profiles.find({}, {$sort: {_id: -1}}).map(function(p) {
            return _.extend(p, {isCurrentProfile: p._id == self.profile_id });
        });
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
    },
    'click .x-edit-show': function(e) {
        var button = $(e.target);
        var showId = button.data('show-id');
        var form = button.closest('.modal-footer').prev('.modal-body').children('form').first();
        var formData = form.serializeArray()
        var showData = {}
        for (var i in formData) {
            var data = formData[i];
            showData[data.name] = data.value;
        }

        Meteor.call('updateShow', showId, showData, function(err) {
            if (err) {
                notify(err.message, 'error');
            }
        });
    }
});
