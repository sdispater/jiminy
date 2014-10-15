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
