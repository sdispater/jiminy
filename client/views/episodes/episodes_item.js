Template.episodesItem.helpers({
    download: function() {
        return Downloads.findOne(this.downloadId);
    },
    releases: function() {
        return Session.get('releases');
    }
});

Template.episodesItem.events({
    'shown.bs.tab a[data-toggle="tab"].releases': function(e) {
        Session.set('releases', null);
        var episodeId = $(e.target).closest('tr').data('episode');
        Meteor.call('searchReleases', episodeId, function(err, res) {
            Session.set('releases', res);
        });
    }
});
