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
    }
});

Template.showsItem.rendered = function(){
    $('.tip').tooltip();
}
