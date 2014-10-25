Episodes = new Meteor.Collection('episodes');

Meteor.methods({
    searchEpisode: function(episodeId) {
        Meteor.call('createJob', 'automaticSearchEpisode', {episodeId: episodeId}, function(err, res) {});
    }
})
