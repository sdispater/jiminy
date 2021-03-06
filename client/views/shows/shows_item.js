Template.showsItem.helpers({
    posterUrl: function() {
        try {
            return Images.findOne({_id: this.images.poster}).url();
        } catch (err) {
            console.log(err);
        }
    },
    currentSeason: function() {
        try {
            return Seasons.findOne({show_id: this._id}, {sort: {number: -1}}).number;
        } catch (err) {
            console.log(err);
        }
    },
    episodesCount: function() {
        return Episodes.find({show_id: this._id}).count();
    },
    downloadedEpisodesCount: function() {
        return Episodes.find({show_id: this._id, file: {$ne: null}}).count();
    },
    downloadedEpisodesPercentage: function() {
        try {
            return Episodes.find({show_id: this._id, file: {$ne: null}}).count()
                / Episodes.find({show_id: this._id}).count() * 100;
        } catch (err) {
            console.log(err);
        }
    },
    profile: function() {
        return Profiles.findOne(this.profile_id);
    },
    availableProfiles: function() {
        return Profiles.find().map(function(p) {
            return _.extend(p, {isCurrentProfile: p._id.str == this.profile_id });
        });
    }
});

Template.showsItem.rendered = function(){
    $('.tip').tooltip();
}

Template.showsItem.events({
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
})
